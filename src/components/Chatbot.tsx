import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Message = {
    sender: "user" | "bot";
    text: string;
};

export function Chatbot() {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const extractRelevantInfo = (query: string, responseText: string) => {
        const lowerQuery = query.toLowerCase();
        
        // Define keywords and extract relevant parts
        const keywordMapping: { [key: string]: string } = {
            "offer": "offer:",
            "charges": "monthly charges:",
            "tenure": "tenure:",
            "contract": "contract:",
            "payment method": "payment method:"
        };

        for (const key in keywordMapping) {
            if (lowerQuery.includes(key)) {
                const keyword = keywordMapping[key];
                const match = responseText.toLowerCase().match(new RegExp(`${keyword}([^,.]+)`, "i"));
                return match ? match[1].trim() : "No relevant information found.";
            }
        }

        return responseText; // Default: return full response if no keyword matches
    };

    const handleSendMessage = useCallback(async () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage || isLoading) return;

        setChatHistory((prev) => [...prev, { sender: "user", text: trimmedMessage }]);
        setMessage("");
        setIsLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/chat";
            const urlWithQuery = `${API_URL}?query=${encodeURIComponent(trimmedMessage)}`;
            console.log("API Request URL: ", urlWithQuery);

            const response = await fetch(urlWithQuery, { method: "GET" });

            let botReply = "I didn't understand that question.";
            if (response.ok) {
                try {
                    const data = await response.json();
                    console.log("API Response Data: ", data);

                    if (data?.response) {
                        botReply = extractRelevantInfo(trimmedMessage, data.response);
                    }
                } catch (error) {
                    console.error("Error parsing JSON response", error);
                    botReply = "Error processing response.";
                }
            } else {
                console.error("API Error: ", response);
                botReply = "Failed to get response from server.";
            }

            setChatHistory((prev) => [...prev, { sender: "bot", text: botReply }]);
        } catch (error) {
            console.error("API Request Error: ", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to connect to the server. Please try again.",
            });
            setChatHistory((prev) => [...prev, { sender: "bot", text: "Connection error, please retry." }]);
        } finally {
            setIsLoading(false);
        }
    }, [message, isLoading, toast]);

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    return (
        <Card className="h-[500px] w-[400px] flex flex-col shadow-md rounded-2xl">
            <CardHeader className="bg-slate-50 border-b px-4 py-3 flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg font-semibold">Customer Support Assistant</CardTitle>
            </CardHeader>

            <ScrollArea className="flex-1 p-4">
                <CardContent className="space-y-4">
                    {chatHistory.length === 0 ? (
                        <div className="text-center text-slate-400 my-8">Ask me anything!</div>
                    ) : (
                        chatHistory.map((chat, index) => (
                            <div
                                key={index}
                                className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-lg shadow-sm ${
                                        chat.sender === "user"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-900"
                                    }`}
                                >
                                    {chat.text}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={chatEndRef} />
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-200 text-gray-900 max-w-[80%] rounded-lg px-4 py-2">
                                <div className="flex space-x-2">
                                    {[0, 150, 300].map((delay) => (
                                        <div
                                            key={delay}
                                            className={`h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-${delay}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </ScrollArea>

            <div className="p-4 border-t flex items-center space-x-2">
                <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 text-sm px-3 py-2 rounded-md border border-gray-300"
                    disabled={isLoading}
                />
                <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !message.trim()}
                    className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                    aria-label="Send message"
                >
                    <Send className="h-4 w-4 text-white" />
                </Button>
            </div>
        </Card>
    );
}

