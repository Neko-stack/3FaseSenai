export const motos = [
  {
    id: 1,
    nome: 'Honda CB 500F',
    categoria: 'Street',
    preco: 39900,
    ano: 2025,
    km: 0,
    cilindradas: 471,
    cor: 'Vermelha',
    destaque: true,
    imagem:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    nome: 'Yamaha MT-03',
    categoria: 'Naked',
    preco: 32990,
    ano: 2024,
    km: 1800,
    cilindradas: 321,
    cor: 'Cinza',
    destaque: false,
    imagem:
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    nome: 'BMW G 310 GS',
    categoria: 'Adventure',
    preco: 42990,
    ano: 2025,
    km: 0,
    cilindradas: 313,
    cor: 'Azul',
    destaque: true,
    imagem:
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    nome: 'Kawasaki Ninja 400',
    categoria: 'Sport',
    preco: 36900,
    ano: 2023,
    km: 5200,
    cilindradas: 399,
    cor: 'Verde',
    destaque: false,
    imagem:
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=900&q=80',
  },
];

export const categorias = ['Todas', ...new Set(motos.map((moto) => moto.categoria))];
