import { ScrollArea } from "@/components/ui/scroll-area";
import CardCafenea from "./components/molecules/CardCafenea";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ICafenea {
  id: number;
  nume: string;
  id_locatie: number;
}

export default function Home() {
  const [cafenea, setCafenea] = useState<ICafenea[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Schimbă portul 3000 cu portul real al backend-ului tău (probabil 3001)
        const [cafeneaRes] = await Promise.all([
          axios.get("http://localhost:3000/api/cafes"),
        ]);

        setCafenea(cafeneaRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array = runs once on mount

  const navigate = useNavigate();

  // Handle "Manage" button click
  const navigateRapoarte = () => {
    navigate(`/rapoarte`);
  };

  

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Button onClick={navigateRapoarte}>Rapoarte</Button>
  
      <ScrollArea className="h-[90%] rounded-md border">
        {cafenea.map((cafenea) => (
          <CardCafenea key={cafenea.id} cafenea={cafenea} />
        ))}
      </ScrollArea>
    </div>
  );
}
