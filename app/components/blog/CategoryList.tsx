import { FC } from 'react';
import Link from 'next/link';

const CategoryList: FC = () => {
  // Simulation de catégories
  const categories = [
    { id: '1', name: 'Développement', slug: 'developpement', count: 15 },
    { id: '2', name: 'Design', slug: 'design', count: 8 },
    { id: '3', name: 'DevOps', slug: 'devops', count: 6 },
    { id: '4', name: 'Mobile', slug: 'mobile', count: 10 },
    { id: '5', name: 'Sécurité', slug: 'securite', count: 7 },
    { id: '6', name: 'Intelligence Artificielle', slug: 'intelligence-artificielle', count: 9 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Catégories</h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <Link 
              href={`/category/${category.slug}`}
              className="flex justify-between items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-800">{category.name}</span>
              <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                {category.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;