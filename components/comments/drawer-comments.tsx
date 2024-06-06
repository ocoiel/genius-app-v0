// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
//   SheetClose,
//   SheetFooter,
// } from "@/components/ui/sheet";
// import { useState } from "react";
// import { Button } from "../ui/button";
// import { Comment } from "@/types/comment";
// import { ScrollArea } from "@radix-ui/react-scroll-area";
// import { randomUUID } from "crypto";
// import { text } from "stream/consumers";
// export const DrawerComments: React.FC = () => {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [sheetOpen, setSheetOpen] = useState(false);

//   const handleAddComment = (text: string, parentId: string | null) => {
//     const newComment: Comment = {
//       id: randomUUID(),
//       text,
//       parentId,
//       replies: [],
//     };

//     setComments((prevComments) => [...prevComments, newComment]);
//   };

//   const handleAddReply = (text: string, parentId: string) => {
//     const newReply: Comment = {
//       id: randomUUID(),
//       text,
//       parentId,
//       replies: [],
//     };

//     setComments((prevComments) =>
//       prevComments.map((comment) =>
//         comment.id === parentId
//           ? { ...comment, replies: [...comment.replies, newReply] }
//           : comment
//       )
//     );
//   };

//   const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
//     <div style={{ marginLeft: comment.parentId ? "20px" : "0" }}>
//       <div>{comment.text}</div>
//       <div>
//         <button onClick={() => handleAddReply("Reply", comment.id)}>
//           Reply
//         </button>
//       </div>
//       {comment.replies.map((reply) => (
//         <CommentItem key={reply.id} comment={reply} />
//       ))}
//     </div>
//   );

//   return (
//     <>
//       <Button onClick={() => setSheetOpen(true)}>Open Sheet</Button>
//       <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
//         <SheetContent>
//           <SheetHeader>
//             <SheetTitle>Comments</SheetTitle>
//             <SheetDescription>Add and manage comments</SheetDescription>
//           </SheetHeader>
//           <ScrollArea>
//             {comments.map((comment) => (
//               <CommentItem key={comment.id} comment={comment} />
//             ))}
//           </ScrollArea>
//           <form onSubmit={(event) => handleAddComment(text, "New comment")}>
//             <input type="text" placeholder="Enter your comment" />
//             <button type="submit">Submit</button>
//           </form>
//           <SheetFooter>
//             <SheetClose asChild>
//               <Button variant="outline">Close</Button>
//             </SheetClose>
//           </SheetFooter>
//         </SheetContent>
//       </Sheet>
//     </>
//   );
// };
