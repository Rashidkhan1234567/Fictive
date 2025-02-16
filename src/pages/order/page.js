"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import Skeleton from "../../components/ui/skeleton";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div>
        <Navbar />
        <div className="container mx-auto p-6 animate-fade-in">
          <h1 className="text-3xl font-bold mb-6 text-center animate-slide-in">
            Orders
          </h1>
          {loading ? (
            <Skeleton className="h-12 w-full mb-4 animate-pulse" />
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500 mt-10 text-lg">
              No orders found. Your order history will appear here.
            </div>
          ) : (
            <Table className="shadow-lg rounded-lg overflow-hidden">
              <TableHeader className="bg-gray-800 text-white">
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ordered At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow
                    key={order.id}
                    className={`transition-all duration-300 ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          src={order.pfp}
                          alt="User"
                          width={40}
                          height={40}
                          className="rounded-full shadow-md"
                        />
                        <p className="text-sm font-medium">{order.userName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          src={order.images[0]}
                          alt={order.productName}
                          width={50}
                          height={50}
                          className="rounded-md shadow-md"
                        />
                        <p className="font-medium">{order.productName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {order.currency} {order.price}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-lg text-white font-bold shadow-md transition-all ${
                          order.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatDate(order.orderedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
