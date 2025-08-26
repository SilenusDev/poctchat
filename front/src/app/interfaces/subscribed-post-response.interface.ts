export interface SubscribedPostResponse {
    id: number;
    title: string | null;
    content: string;
    createdAt: string; // Vous pouvez transformer cette chaîne en Date si besoin
    author: {
      name: string;
      email: string;
      createdAt: string;
    };
    subject: {
      name: string;
      description: string;
    };
  }