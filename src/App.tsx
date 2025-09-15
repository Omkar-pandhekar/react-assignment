import "./App.css";
import ArtTable from "./components/Table";

function App() {
  return (
    <>
      <div className="md:max-w-[1600px] mx-auto">
        <ArtTable initialRows={10} />
      </div>
    </>
  );
}

export default App;
