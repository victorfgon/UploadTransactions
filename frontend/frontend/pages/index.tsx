import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();

  const handleUploadClick = () => {
    router.push('/upload');
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={handleUploadClick}>Upload Transactions</button>
    </div>
  );
};

export default HomePage;
