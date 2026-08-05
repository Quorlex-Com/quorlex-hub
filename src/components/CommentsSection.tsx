import React, { useState } from 'react';
import { Star, ThumbsUp, Send, CheckCircle2, User } from 'lucide-react';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';

interface CommentsSectionProps {
  itemId: string;
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  itemId,
  comments,
  onAddComment,
}) => {
  const { user } = useAuth();

  const [authorName, setAuthorName] = useState(user?.name || '');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      itemId,
      authorName: authorName.trim() || 'Anonymous Explorer',
      authorAvatar: user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
      authorUid: user?.uid || `guest-${Date.now()}`,
      content: content.trim(),
      rating,
      upvotes: 1,
      createdAt: new Date().toISOString(),
      isVerifiedDownloader: true,
    };

    onAddComment(newComment);
    setContent('');
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Submit New Review / Comment Form */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
        <h4 className="font-bold text-slate-100 text-sm flex items-center justify-between">
          <span>Leave a Review or Comment</span>
          <span className="text-xs text-slate-400 font-normal">Community Verified</span>
        </h4>

        {/* Rating Stars Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Your Rating:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 focus:outline-none transition-transform hover:scale-125"
              >
                <Star
                  className={`w-4 h-4 ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 ml-1">{rating}.0</span>
        </div>

        {/* Author Name Input */}
        <div>
          <input
            type="text"
            placeholder="Your Display Name (e.g. Alex_Vortex)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Comment Textarea */}
        <div>
          <textarea
            rows={3}
            placeholder="Share your experience, tips, performance feedback, or installation questions..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 disabled:opacity-50 transition-all shadow-md shadow-cyan-500/10"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Review</span>
          </button>
        </div>
      </form>

      {/* Posted Comments List */}
      <div className="space-y-3">
        <h4 className="font-bold text-slate-200 text-sm">
          Community Discussions ({comments.length})
        </h4>

        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={comment.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${comment.authorName}`}
                    alt={comment.authorName}
                    className="w-7 h-7 rounded-lg bg-slate-800"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-200 block">
                      {comment.authorName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Rating & Verified Badge */}
                <div className="flex items-center gap-2">
                  {comment.isVerifiedDownloader && (
                    <span className="hidden sm:flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified User</span>
                    </span>
                  )}
                  <div className="flex items-center gap-0.5 text-amber-400 text-xs font-bold font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{comment.rating}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {comment.content}
              </p>

              <div className="flex items-center justify-end pt-1">
                <button
                  onClick={() => {
                    // Simple upvote UI trigger
                  }}
                  className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({comment.upvotes || 1})</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs font-mono">
            No reviews yet. Be the first to leave feedback!
          </div>
        )}
      </div>

    </div>
  );
};
