import { useState, useRef, useEffect, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Send, X, Bot } from "lucide-react";

type Message = {
  id: number;
  from: "bot" | "user";
  text: string;
};

type Rule = {
  keywords: string[];
  reply: string;
};

// A small rule-based knowledge base — matches keywords in what the visitor
// types and replies with the closest answer. Not an AI model; just fast,
// reliable answers to the questions people actually ask a tailoring shop.
const RULES: Rule[] = [
  {
    keywords: ["hour", "open", "close", "time"],
    reply:
      "We're open Mon–Sat, 10:00–19:00, by appointment. You can request a specific time on the Contact page.",
  },
  {
    keywords: ["location", "address", "where", "atelier", "shop location", "visit"],
    reply: "The atelier is at 42 Elgin Street, Mayfair, London W1K.",
  },
  {
    keywords: ["price", "cost", "how much", "fee", "rate"],
    reply:
      "Pricing varies by service — Custom Suits start from $899, Shirts from $189, Alterations from $39. See the Services page for the full list.",
  },
  {
    keywords: ["book", "appointment", "fitting", "schedule", "reserve"],
    reply:
      "You can book a fitting on the Contact page — choose an in-store visit, home visit, or video consultation.",
  },
  {
    keywords: ["service", "offer", "what do you do", "suit", "wedding", "alteration", "sherwani"],
    reply:
      "We offer Custom Suits, Wedding Suits, Shirts, Tailored Pants, Sherwani, Waistcoats, Alterations, Uniform Stitching, Women's Dresses, and Kids Clothing. Full details on the Services page.",
  },
  {
    keywords: ["shop", "buy", "product", "fabric", "cufflink", "belt", "shoe"],
    reply:
      "The Shop page has ready-made garments, fabrics, and accessories you can browse by category.",
  },
  {
    keywords: ["account", "login", "log in", "sign up", "signup", "register", "password"],
    reply:
      "You can create a Buyer or Seller account from the Sign Up page. Buyers can track fitting requests; Sellers can list their own products and services.",
  },
  {
    keywords: ["seller", "sell", "list a product", "become a seller"],
    reply:
      "Sign up as a Seller, then head to your Seller Dashboard to list products and services — you'll be able to create, edit and remove your own listings any time.",
  },
  {
    keywords: ["contact", "phone", "email", "reach", "call"],
    reply:
      "You can reach us at +44 20 7946 0128 or atelier@tailorhub.co, or use the form on the Contact page.",
  },
  {
    keywords: ["delivery", "shipping", "how long", "turnaround", "ready"],
    reply:
      "Turnaround depends on the service — most alterations take 3–7 days, custom suits 3–4 weeks, and wedding suits 5–6 weeks. Exact timing is shown on each service.",
  },
  {
    keywords: ["hi", "hello", "hey", "salam", "assalam"],
    reply:
      "Hello! I'm the TailorHub assistant. Ask me about our services, prices, hours, or how to book a fitting.",
  },
  {
    keywords: ["thank", "thanks", "shukriya"],
    reply: "You're welcome! Anything else I can help with?",
  },
];

const FALLBACK =
  "I'm not sure about that one — but our team can help directly. Try the Contact page, or ask me about services, prices, hours, or booking.";

function getReply(input: string): string {
  const text = input.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => text.includes(k))) {
      return rule.reply;
    }
  }
  return FALLBACK;
}

const SUGGESTIONS = [
  "What services do you offer?",
  "How do I book a fitting?",
  "What are your hours?",
  "How do I become a seller?",
];

let nextId = 1;

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nextId++,
      from: "bot",
      text: "Hi! I'm the TailorHub assistant — ask me about services, prices, hours, or booking a fitting.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = { id: nextId++, from: "user", text: trimmed };
    const botMsg: Message = { id: nextId++, from: "bot", text: getReply(trimmed) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl sm:w-96">
          <div className="flex items-center justify-between border-b border-border/60 bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span className="text-sm font-medium">TailorHub Assistant</span>
            </div>
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="hover:opacity-80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    m.from === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-gold/30 px-3 py-1.5 text-xs text-gold hover:bg-gold/10"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border/60 p-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                className="flex-1 rounded-full border border-border bg-secondary px-4 py-2 text-sm outline-none focus:border-gold"
              />
              <button
                type="submit"
                aria-label="Send"
                className="rounded-full bg-primary p-2.5 text-primary-foreground hover:opacity-90"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Automated assistant · for anything else, use{" "}
              <Link
                to="/contact"
                className="text-gold hover:underline"
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>
            </p>
          </div>
        </div>
      )}

      <button
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
