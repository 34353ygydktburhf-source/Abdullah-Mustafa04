import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNotifications, NotificationType } from "./NotificationContext";

export type OrderStatus = "pending" | "processing" | "done" | "rejected";

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userContact: string;
  gameId: string;
  gameName: string;
  packageName: string;
  packagePrice: number;
  quantity: number;
  totalPrice: number;
  fields: Record<string, string>; // PlayerID, etc.
  paymentMethod: string;
  senderInfo?: string; // The number/account they transferred from
  status: OrderStatus;
  timestamp: string;
  screenshot?: string; // Base64 proof of transfer
  adminNote?: string; // Message from admin about this status
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "status" | "timestamp">) => string;
  updateOrderStatus: (id: string, status: OrderStatus, note?: string) => void;
  deleteOrder: (id: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const { addNotification } = useNotifications();
  const [orders, setOrders] = useState<Order[]>([]);
  const isInitialized = React.useRef(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("al_lord_orders");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
        }
      } catch (e) {
        console.error("Failed to parse orders", e);
      }
    }
    isInitialized.current = true;
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem("al_lord_orders", JSON.stringify(orders));
    }
  }, [orders]);

  const addOrder = (orderData: Omit<Order, "id" | "status" | "timestamp">): string => {
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: "pending",
      timestamp: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);

    // Initial notification for user
    addNotification(
      "تم استلام طلبك! 🎮", 
      `طلبك رقم ${orderId} قيد المراجعة الآن. سنقوم بإبلاغك فور تحديث الحالة.`,
      "info"
    );

    return orderId;
  };

  const updateOrderStatus = (id: string, status: OrderStatus, note?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === id) {
        const oldStatus = order.status;
        if (oldStatus !== status) {
          // Trigger notification for the user
          let title = "تحديث حالة الطلب 📦";
          let message = `تم تغيير حالة طلبك رقم ${id} إلى: ${getStatusText(status)}`;
          let type: NotificationType = "info";

          if (status === "done") {
            title = "تم اكتمال طلبك! 🎉";
            message = `مبروك! تم شحن طلبك رقم ${id} بنجاح. ${note || "استمتع بلعبتك!"}`;
            type = "success";
          } else if (status === "rejected") {
            title = "تعذر تنفيذ الطلب ❌";
            message = `نأسف، تم رفض طلبك رقم ${id}. ${note || "يرجى التواصل مع الدعم للمزيد من التفاصيل."}`;
            type = "error";
          } else if (status === "processing") {
            message = `طلبك رقم ${id} قيد التنفيذ الآن. يرجى الانتظار قليلاً.`;
          }

          addNotification(title, message, type);
        }
        return { ...order, status, adminNote: note || order.adminNote };
      }
      return order;
    }));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "pending": return "قيد الانتظار";
      case "processing": return "قيد التنفيذ";
      case "done": return "تم الاكتمال";
      case "rejected": return "مرفوض";
      default: return status;
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
