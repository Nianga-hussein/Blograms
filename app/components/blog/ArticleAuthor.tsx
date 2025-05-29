import Image from "next/image";
import Link from "next/link";

interface AuthorProps {
  author: {
    id: string;
    name: string;
    image: string;
  };
  date: string;
}

export default function ArticleAuthor({ author, date }: AuthorProps) {
  // Formater la date
  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center">
      <Link href={`/author/${author.id}`} className="flex items-center group">
        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative mr-3">
          {/* Placeholder pour l'image */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
            {author.name}
          </p>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
      </Link>
    </div>
  );
}