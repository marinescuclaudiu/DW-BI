import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

import axios from "axios";
import { DropdownMenuDemo } from "./components/molecules/DropdownMenu";

// Types
export interface Categorie {
  id: number;
  denumire: string;
}

export interface Subcategorie {
  id: number;
  denumire: string;
  id_categorie: number;
}

export interface Produs {
  id: number;
  denumire: string;
  dimensiune: string;
  unitate_masura: string;
  pret: number;
  activ: string;
  id_subcategorie: number;
}

export interface Discount extends Produs {
  id_produs: number;
  procent_reducere: number;
}

export interface ProdusComanda extends Produs {
  cantitate: number;
}

export default function CafeneaDetail() {
  const { id_cafenea } = useParams(); // Access the id_cafenea from the URL parameter
  const [cart, setCart] = useState<ProdusComanda[]>([]);
  const [categorii, setCategorii] = useState<Categorie[]>([]);
  const [subcategorii, setSubcategorii] = useState<Subcategorie[]>([]);
  const [produse, setProduse] = useState<Produs[]>([]);
  const [discount, setDiscount] = useState<Discount[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Schimbă portul 3000 cu portul real al backend-ului tău (probabil 3001)
        const [categoriesRes, subcategoriesRes, productsRes, discountRes] =
          await Promise.all([
            axios.get("http://localhost:3000/api/categories"),
            axios.get("http://localhost:3000/api/subcategories"),
            axios.get("http://localhost:3000/api/products"),
            axios.get("http://localhost:3000/api/products/activeDiscount"),
          ]);

        setCategorii(categoriesRes.data);
        setSubcategorii(subcategoriesRes.data);
        setProduse(productsRes.data);
        setDiscount(discountRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array = runs once on mount

  const addToCart = (produs: Produs) => {
    const discountProdus = discount.find((d) => d.id_produs === produs.id);

    const productToCart: ProdusComanda = { ...produs, cantitate: 0 };
    if (discountProdus) {
      productToCart.pret = produs.pret * (1 - discountProdus.procent_reducere);
    }

    if (cart.find((p) => p.id === produs.id)) {
      cart.find((p) => p.id === produs.id).cantitate += 1;
      setCart([...cart]);
    } else {
      setCart((prevCart) => [...prevCart, productToCart]);
    }
    productToCart.cantitate += 1;
    console.log("Adding to cart:", cart);
  };

  return (
    <div className="p-6 bg-amber-50 text-gray-900 ">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">
          Details for Cafenea {id_cafenea}
        </h1>
        <DropdownMenuDemo
          cart={cart}
          idCafenea={id_cafenea}
          setCart={setCart}
        />
        <Button
          variant="outline"
          className="bg-amber-600 text-white hover:bg-amber-700 rounded"
          onClick={() => history.back()}
        >
          Go Back
        </Button>
      </div>
      <Accordion
        type="single"
        collapsible
        className="w-full border border-amber-800 bg-amber-100 rounded-lg shadow-md"
      >
        {categorii.map((categorie) => (
          <AccordionItem
            key={categorie.id}
            value={`item-${categorie.id}`}
            className="border-b border-amber-300"
          >
            <AccordionTrigger className="px-4 py-2 text-lg font-medium text-amber-900 hover:bg-amber-200 rounded">
              {categorie.denumire}
            </AccordionTrigger>
            <AccordionContent className="pl-6 py-3 text-sm bg-amber-50 border-l border-amber-300">
              {subcategorii
                .filter(
                  (subcategorie) => subcategorie.id_categorie === categorie.id
                )
                .map((subcategorie) => (
                  <Accordion
                    key={subcategorie.id}
                    type="single"
                    collapsible
                    className="border border-amber-600 bg-amber-200 rounded-md mb-2"
                  >
                    <AccordionItem value={`item-${subcategorie.id}`}>
                      <AccordionTrigger className="px-3 py-2 text-md font-semibold text-amber-800 hover:bg-amber-300 rounded">
                        {subcategorie.denumire}
                      </AccordionTrigger>
                      <AccordionContent className="pl-5 py-2 text-sm bg-amber-100 border-l border-amber-400">
                        <ul className="space-y-2">
                          {produse
                            .flat()
                            .filter(
                              (produs) =>
                                produs.id_subcategorie === subcategorie.id
                            )
                            .map((produs) => {
                              // Find discount for current product
                              const productDiscount = discount.find(
                                (d) => d.id_produs === produs.id
                              );

                              return (
                                <div key={produs.id}>
                                  {/* Discount badge */}
                                  {productDiscount && (
                                    <Badge className="bg-red-600 text-white relative top-[10px]">
                                      -
                                      {Math.round(
                                        100 * productDiscount.procent_reducere
                                      )}
                                      %
                                    </Badge>
                                  )}

                                  <li className="flex items-center justify-between bg-amber-50 border border-amber-300 rounded-md px-3 py-2">
                                    <span>
                                      {produs.denumire} - {produs.dimensiune} -{" "}
                                      {productDiscount ? (
                                        // Display both prices if discount exists
                                        <>
                                          <span className="line-through text-red-600">
                                            {produs.pret.toFixed(2)} RON
                                          </span>
                                          <span className="ml-2 text-green-600">
                                            {(
                                              produs.pret *
                                              (1 -
                                                productDiscount.procent_reducere)
                                            ).toFixed(2)}{" "}
                                            RON
                                          </span>
                                        </>
                                      ) : (
                                        // Display normal price if no discount
                                        <span>
                                          {produs.pret.toFixed(2)} RON
                                        </span>
                                      )}
                                    </span>
                                    <Button
                                      variant="outline"
                                      className="ml-4 bg-amber-600 text-white hover:bg-amber-700 rounded"
                                      onClick={() => addToCart(produs)}
                                    >
                                      <ShoppingCart className="w-5 h-5 text-white" />
                                    </Button>
                                  </li>
                                </div>
                              );
                            })}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
