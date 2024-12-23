import React from "react";
import { User } from "lucide-react";
import { DateFormat } from "../../../utils/format";

const Comments = ({ comments, newComment, onCommentChange, onAddComment }) => (
  <div className="p-6">
    <h2 className="text-lg font-medium mb-4">Comments</h2>
    <div className="space-y-4">
      {comments?.map((comment) => (
        <div key={comment.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0">
            {comment.user.profile ? (
              <img
                src={comment.user.profile}
                alt={comment.user.username}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <User className="w-8 h-8 p-1 bg-gray-200 rounded-full" />
            )}
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.user.username}</span>
              <span className="text-sm text-gray-500">
                {DateFormat(comment.created_at)}
              </span>
              {comment.is_internal && (
                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Internal Note
                </span>
              )}
            </div>
            <p className="mt-1 text-gray-600">{comment.comment}</p>
          </div>
        </div>
      ))}
      <div className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Add an internal note..."
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button
          onClick={onAddComment}
          disabled={!newComment.trim()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Internal Note
        </button>
      </div>
    </div>
  </div>
);

export default Comments;
