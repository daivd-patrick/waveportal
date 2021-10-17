function App() {
  const wave = () => {};

  return (
    <div className="max-w-md mx-auto p-10">
      <div className="flex flex-col items-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          👋 Hey there!
        </h1>
        <p className="text-gray-600 max-w-md">
          I am Andres and I am learning web3 and smart contracts!
        </p>
        <button
          className="px-4 py-2 rounded-xl bg-blue-600 text-white"
          onClick={wave}
        >
          Wave at me!
        </button>
      </div>
    </div>
  );
}

export default App;
