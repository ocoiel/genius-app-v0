"use client";
import { useState, useEffect, useRef } from "react";
import { isRangeAnnotated, calculateCharacterOffset } from "./utils";

export type Annotation = {
  id: string;
  startIndex: number;
  endIndex: number;
  text: string;
  comment: string;
};

const Lyrics: React.FC<{ lyrics: string }> = ({ lyrics }) => {
  const [annotations, setAnnotations] = useState<Annotation[]>(() => {
    // Verifica se o localStorage está disponível
    if (typeof window !== "undefined") {
      // Se estiver disponível, tenta recuperar as anotações do localStorage
      const savedAnnotations = localStorage.getItem("annotations");
      // Verifica se há anotações salvas e as retorna, caso contrário, retorna um array vazio
      return savedAnnotations ? JSON.parse(savedAnnotations) : [];
    } else {
      // Se o localStorage não estiver disponível (por exemplo, durante a build), retorna um array vazio
      return [];
    }
  });

  const [selectedText, setSelectedText] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [selectionRange, setSelectionRange] = useState<[number, number] | null>(
    null
  );
  const [showAnnotation, setShowAnnotation] = useState<string | null>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const lyricsRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    // Salva as anotações no localStorage sempre que houver uma alteração
    localStorage.setItem(
      "annotations-genius-app-test",
      JSON.stringify(annotations)
    );
  }, [annotations]);

  // Efeito para adicionar um event listener para a tecla ESC para fechar o painel de comentários
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCommentPanel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Função para lidar com o evento de mouse up (quando o usuário termina de selecionar o texto)
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const text = selection.toString();

      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preElement = lyricsRef.current;
        if (preElement) {
          const startContainer = range.startContainer;
          const startOffset = range.startOffset;
          const endContainer = range.endContainer;
          const endOffset = range.endOffset;

          const startIndex = calculateCharacterOffset(
            startContainer,
            startOffset,
            preElement
          );
          const endIndex = calculateCharacterOffset(
            endContainer,
            endOffset,
            preElement
          );

          // Verifica se o trecho selecionado já está anotado
          if (isRangeAnnotated(annotations, startIndex, endIndex)) {
            return; // Não faz nada se o trecho já está anotado
          }

          const rect = range.getBoundingClientRect();
          const offsetTop = window.scrollY + rect.top;
          const offsetLeft = window.scrollX + rect.left;

          setSelectedText(text);
          setSelectionRange([startIndex, endIndex]);
          setPosition({ top: offsetTop, left: offsetLeft });
        }
      }
    }
  };

  const handleAddAnnotation = () => {
    if (selectionRange) {
      setAnnotations([
        ...annotations,
        {
          id: Math.random().toString(36).substring(2, 9),
          startIndex: selectionRange[0],
          endIndex: selectionRange[1],
          text: selectedText,
          comment: comment,
        },
      ]);
      closeCommentPanel();
    }
  };

  const closeCommentPanel = () => {
    setSelectedText("");
    setSelectionRange(null);
    setComment("");
    setPosition(null);
  };

  const handleAnnotationClick = (id: string) => {
    setShowAnnotation(showAnnotation === id ? null : id);
  };

  const handleDeleteAnnotation = (id: string) => {
    const updatedAnnotations = annotations.filter(
      (annotation) => annotation.id !== id
    );
    setAnnotations(updatedAnnotations);
  };

  // Função para renderizar a letra da música destacando as partes anotadas pelo usuário
  const highlightedLyrics = () => {
    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    // Ordena as anotações por ordem de início
    const sortedAnnotations = [...annotations].sort(
      (a, b) => a.startIndex - b.startIndex
    );

    sortedAnnotations.forEach((annotation) => {
      // Adiciona o trecho de texto antes da anotação
      parts.push(
        <span key={`text-${lastIndex}`}>
          {lyrics.slice(lastIndex, annotation.startIndex)}
        </span>
      );
      // Adiciona a anotação
      parts.push(
        <span
          key={annotation.id}
          className="bg-yellow-300 cursor-pointer"
          onClick={() => handleAnnotationClick(annotation.id)}
        >
          {lyrics.slice(annotation.startIndex, annotation.endIndex)}
        </span>
      );
      // Atualiza o índice do último caractere processado
      lastIndex = annotation.endIndex;
    });

    // Adiciona o restante do texto após a última anotação
    parts.push(
      <span key={`text-${lastIndex}`}>{lyrics.slice(lastIndex)}</span>
    );

    return parts;
  };

  return (
    <div className="relative">
      <pre
        ref={lyricsRef}
        onMouseUp={handleMouseUp}
        className="whitespace-pre-wrap"
      >
        {highlightedLyrics()}
      </pre>
      {selectedText && position && (
        <div
          className="absolute p-2 bg-gray-200 border border-gray-400 rounded"
          style={{ top: position.top - 50, left: position.left }}
        >
          <button
            onClick={closeCommentPanel}
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded"
          >
            X
          </button>
          <h4>{selectedText}</h4>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            className="w-full border border-gray-300 rounded p-1 mt-1"
          />
          <button
            onClick={handleAddAnnotation}
            className="mt-1 bg-blue-500 text-white p-1 rounded"
          >
            Add Annotation
          </button>
        </div>
      )}
      <div className="mt-4">
        <h3>Annotations:</h3>
        <ul>
          {annotations.map((annotation) => (
            <li key={annotation.id}>
              <strong
                className="cursor-pointer text-blue-500 underline"
                onClick={() => handleAnnotationClick(annotation.id)}
              >
                {annotation.text}
              </strong>
              : {annotation.comment}
              <button
                onClick={() => handleDeleteAnnotation(annotation.id)}
                className="ml-2 text-red-500"
              >
                Delete
              </button>
              {showAnnotation === annotation.id && (
                <div className="mt-2 p-2 bg-gray-200 border border-gray-400 rounded">
                  {annotation.comment}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Lyrics;
