import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLanding, Landing } from "@pages";
import Provider from "./pages/app/providers";


function App() {
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <main className="dark w-screen h-screen overflow-y-scroll bg-background dark:bg-background-dark">
       <Routes>
        <Route path="/" element={ <Landing/>}/>
        <Route path="/app" element={ <AppLanding/>}/>
        <Route path="/providers" element={ <Provider/>}/>
      
       </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
