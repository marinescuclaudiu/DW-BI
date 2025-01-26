import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CoffeeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ICafenea {
  id: number;
  nume: string;
  id_locatie: number;
}

interface CardCafeneaProps {
  cafenea: ICafenea;
}

export default function CardCafenea({ cafenea }: CardCafeneaProps) {
  const navigate = useNavigate();

  // Handle "Manage" button click
  const handleManageClick = () => {
    navigate(`/cafenea/${cafenea.id}`);
  };
  return (
    <Card className="w-[380px]">
      <CardHeader className="flex">
        <div className="flex items-center gap-2">
          <CoffeeIcon />
          <CardTitle>{cafenea.nume}</CardTitle>
        </div>
        <CardDescription>{cafenea.id_locatie}</CardDescription>
      </CardHeader>
      <CardFooter onClick={handleManageClick}>
        <Button className="w-full">Manage</Button>
      </CardFooter>
    </Card>
  );
}
