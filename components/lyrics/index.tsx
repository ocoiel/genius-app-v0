"use client";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Popover, PopoverContent } from "@/components/ui/popover";

import { isRangeAnnotated, calculateCharacterOffset } from "./utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
// import { DrawerComments } from "../comments/drawer-comments";

export type AnnotationResponse = {
  id: string;
  text: string;
  parentId: string | null; // null se é um comentário raíz (princial/não resposta)
  likes: number;
  responses: AnnotationResponse[];
};

export type Annotation = {
  id: string;
  startIndex: number;
  endIndex: number;
  text: string;
  comment: string;
  likes: number;
  responses: AnnotationResponse[];
};

const Lyrics: React.FC<{ lyrics: string }> = ({ lyrics }) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

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
  const [popoverPosition, setPopoverPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const lyricsRef = useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

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

  const handleAddResponse = (
    annotationId: string,
    text: string,
    parentId: string | null = null
  ) => {
    const newResponse: AnnotationResponse = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      parentId,
      likes: 0,
      responses: [],
    };

    setAnnotations((prevAnnotations) =>
      prevAnnotations.map((annotation) =>
        annotation.id === annotationId
          ? {
              ...annotation,
              responses: [...annotation.responses, newResponse],
            }
          : annotation
      )
    );
  };

  const handleLike = (
    annotationId: string,
    responseId: string | null = null
  ) => {
    setAnnotations((prevAnnotations) =>
      prevAnnotations.map((annotation) =>
        annotation.id === annotationId
          ? responseId
            ? {
                ...annotation,
                responses: annotation.responses.map((response) =>
                  response.id === responseId
                    ? { ...response, likes: response.likes + 1 }
                    : response
                ),
              }
            : { ...annotation, likes: annotation.likes + 1 }
          : annotation
      )
    );
  };

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

          if (position) {
            const selectedTextRect = window
              .getSelection()
              ?.getRangeAt(0)
              .getBoundingClientRect();
            const popoverTop = selectedTextRect
              ? selectedTextRect.top + selectedTextRect.height / 2
              : 0;
            const popoverLeft = selectedTextRect
              ? selectedTextRect.left + selectedTextRect.width / 2
              : 0;
            setPopoverPosition({ top: popoverTop, left: popoverLeft });
          }

          const rect = range.getBoundingClientRect();
          const offsetTop = window.scrollY + rect.top;
          const offsetLeft = window.scrollX + rect.left;

          // Calcula a posição centralizada (e incial) do popover
          const selectedTextRect = window
            .getSelection()
            ?.getRangeAt(0)
            .getBoundingClientRect();
          const popoverTop = selectedTextRect
            ? selectedTextRect.top + selectedTextRect.height / 2
            : 0;
          const popoverLeft = selectedTextRect
            ? selectedTextRect.left + selectedTextRect.width / 2
            : 0;

          setSelectedText(text);
          setSelectionRange([startIndex, endIndex]);
          setPosition({ top: offsetTop, left: offsetLeft });
          setPopoverPosition({ top: popoverTop, left: popoverLeft });
          setPopoverOpen(true);
        }
      }
    }
  };

  const handleAddAnnotation = () => {
    if (selectionRange && comment.length > 3) {
      setAnnotations([
        ...annotations,
        {
          id: Math.random().toString(36).substring(2, 9),
          startIndex: selectionRange[0],
          endIndex: selectionRange[1],
          text: selectedText,
          comment: comment,
          likes: 0,
          responses: [],
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
    setDialogOpen(false);
    setPopoverOpen(false);
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
          className="bg-yellow-300 dark:text-neutral-900 cursor-pointer"
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

  const renderAnnotationPanel = () => (
    <div className="flex flex-col gap-4 p-4 sm:p-0">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Qual o significado desse trecho?"
        className="w-full border border-gray-300 rounded p-1 mt-1"
      />
      <Button onClick={handleAddAnnotation} className="p-1 rounded">
        Add Annotation
      </Button>
    </div>
  );

  return (
    <div className="relative">
      <div
        ref={lyricsRef}
        onMouseUp={handleMouseUp}
        className="whitespace-pre-wrap"
      >
        {highlightedLyrics()}
      </div>
      {selectedText && position && (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverContent
            asChild
            style={{
              position: "absolute",
              top: (popoverPosition?.top ?? position.top) - 50,
              left: popoverPosition?.left ?? position.left,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Button
              variant={"secondary"}
              onClick={() => {
                setDialogOpen(true);
                setPopoverOpen(false);
              }}
              className="p-2 rounded cursor-pointer"
            >
              Escreva o significado
            </Button>
          </PopoverContent>
        </Popover>
      )}
      {isDesktop ? (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Anotação</DialogTitle>
              <DialogDescription>
                Adicione um comentário para o trecho selecionado.
              </DialogDescription>
            </DialogHeader>
            {renderAnnotationPanel()}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={dialogOpen} onOpenChange={setDialogOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Adicionar Anotação</DrawerTitle>
              <DrawerDescription>
                Adicione um comentário para o trecho selecionado.
              </DrawerDescription>
            </DrawerHeader>
            {renderAnnotationPanel()}
          </DrawerContent>
        </Drawer>
      )}
      {/* <DrawerComments /> */}
    </div>
  );
};

export default Lyrics;
