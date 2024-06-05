// Função para calcular o deslocamento de caracteres dentro do nó de texto
export const calculateCharacterOffset = (
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
