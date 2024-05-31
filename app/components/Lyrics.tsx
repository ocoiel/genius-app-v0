import React, { useState, useEffect, useRef } from "react";

type Annotation = {
  startIndex: number;
  endIndex: number;
  text: string;
  comment: string;
};

const Lyrics: React.FC<{ lyrics: string }> = ({ lyrics }) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedText, setSelectedText] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [selectionRange, setSelectionRange] = useState<[number, number] | null>(
    null
  );
  const [showAnnotation, setShowAnnotation] = useState<number | null>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const lyricsRef = useRef<HTMLPreElement>(null);

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

  // Função para calcular o deslocamento de caracteres dentro do nó de texto
  const calculateCharacterOffset = (
    node: Node,
    offset: number,
    parent: HTMLElement
  ): number => {
    let charCount = 0;
    const treeWalker = document.createTreeWalker(
      parent,
      NodeFilter.SHOW_TEXT,
      null
    );

    while (treeWalker.nextNode()) {
      const currentNode = treeWalker.currentNode;
      if (currentNode === node) {
        return charCount + offset;
      }
      charCount += currentNode.textContent?.length || 0;
    }
    return charCount;
  };

  const handleAddAnnotation = () => {
    if (selectionRange) {
      setAnnotations([
        ...annotations,
        {
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

  const handleAnnotationClick = (index: number) => {
    setShowAnnotation(showAnnotation === index ? null : index);
  };

  // Função para renderizar a letra da música destacando as partes anotadas pelo usuário
  const highlightedLyrics = () => {
    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    annotations
      .sort((a, b) => a.startIndex - b.startIndex)
      .forEach((annotation, index) => {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {lyrics.slice(lastIndex, annotation.startIndex)}
          </span>
        );
        parts.push(
          <span
            key={`highlight-${index}`}
            className="bg-yellow-300 cursor-pointer"
            onClick={() => handleAnnotationClick(index)}
          >
            {lyrics.slice(annotation.startIndex, annotation.endIndex)}
          </span>
        );
        lastIndex = annotation.endIndex;
      });

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
          {annotations.map((annotation, index) => (
            <li key={index}>
              <strong
                className="cursor-pointer text-blue-500 underline"
                onClick={() => handleAnnotationClick(index)}
              >
                {annotation.text}
              </strong>
              : {annotation.comment} (start: {annotation.startIndex}, end:{" "}
              {annotation.endIndex})
              {showAnnotation === index && (
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
