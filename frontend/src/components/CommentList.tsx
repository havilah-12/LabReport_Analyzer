import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MessageSquare, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface Comment {
  id: number;
  text: string;
  status?: string;
}

const CommentList = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/comments-analytics");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch comments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const getStatusIcon = (status?: string) => {
    const baseClass = "h-6 w-6 p-1 rounded-full";
    switch (status) {
      case "warning":
        return (
          <div className={`${baseClass} bg-yellow-100 text-yellow-600`}>
            <AlertTriangle />
          </div>
        );
      case "mild":
        return (
          <div className={`${baseClass} bg-green-100 text-green-600`}>
            <CheckCircle />
          </div>
        );
      case "info":
        return (
          <div className={`${baseClass} bg-blue-100 text-blue-600`}>
            <Info />
          </div>
        );
      default:
        return (
          <div className={`${baseClass} bg-gray-100 text-gray-500`}>
            <MessageSquare />
          </div>
        );
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-200">
            Warning
          </Badge>
        );
      case "mild":
        return (
          <Badge className="bg-green-100 text-green-700 border border-green-200">
            Mild
          </Badge>
        );
      case "info":
        return (
          <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
            Info
          </Badge>
        );
      default:
        return <Badge variant="outline">Uncategorized</Badge>;
    }
  };

  const getCommentBg = (status?: string) => {
    switch (status) {
      case "warning":
        return "bg-yellow-50";
      case "mild":
        return "bg-green-50";
      case "info":
        return "bg-blue-50";
      default:
        return "bg-gray-50";
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-md rounded-2xl border border-transparent">
        <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-2xl">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <MessageSquare className="h-6 w-6" />
            Patient Comments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md rounded-2xl border border-transparent bg-white">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-2xl">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <MessageSquare className="h-6 w-6" />
            Patient Comments
          </div>
          <Badge className="bg-white text-purple-700 border border-purple-200">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="text-md">No comments available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`rounded-xl p-4 transition-shadow hover:shadow-md border border-transparent ${getCommentBg(
                  comment.status
                )}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(comment.status)}
                  {getStatusBadge(comment.status)}
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">
                  {comment.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentList;
