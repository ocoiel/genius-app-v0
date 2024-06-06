// import { Comment } from "@/types/comment";
// const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
//   const handleAddReply = (text: string, parentId: string) => {
//     const newReply: Comment = {
//       id: uuidv4(),
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

//   return (
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
// };
