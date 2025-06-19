import { format } from 'date-fns';

export default function Comments({ comments }) {
  if (!comments || comments.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Comments</h3>
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Comments ({comments.length})</h3>
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-900">{comment.name}</div>
              <time className="text-sm text-gray-500">
                {format(new Date(comment.createdAt), 'MMMM d, yyyy')}
              </time>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 