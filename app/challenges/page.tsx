"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Flag, Timer, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Cookies from 'js-cookie';

const SimplePopup = ({ isOpen, data, onClose }: { isOpen: boolean, data: any, onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-blue-300 rounded-md shadow-md w-[90%] max-w-sm p-4">
        <h2 className="text-lg font-semibold text-center mb-4">Challenge Details</h2>
        <div className="space-y-2">
          <p>
            <strong>URL:</strong>{" "}
            <a
              href={data?.ctfdurl || `http://localhost:10001`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {data?.ctfdurl || `http://localhost:10001`}
            </a>
          </p>
          <p>
            <strong>Password:</strong> {data?.password || `admin123`}
          </p>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


export default function ChallengePage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [roomId, setRoomId] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(299); // Unique user ID for the API
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<any>(""); 

  useEffect(() => {
    const storedUserId = Cookies.get('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // State for challenges
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "Web Exploitation 101",
      category: "Web",
      difficulty: "Easy",
      points: 100,
      participants: 45,
      timeLimit: "2 hours",
      description: "Learn the basics of web exploitation through a series of challenges.",
    },
    {
      id: 2,
      title: "Cryptography Master",
      category: "Crypto",
      difficulty: "Hard",
      points: 300,
      participants: 12,
      timeLimit: "3 hours",
      description: "Test your cryptography skills with advanced encryption challenges.",
    },
  ]);

  // Mapping difficulty to numeric levels
  const difficultyMapping = {
    Easy: 1,
    Medium: 2,
    Hard: 3,
  };

  // Function to handle room creation
  const handleCreateRoom = async () => {

    const newId = Math.floor(Math.random() * 1000);

    setRoomId(newId)
    if (!roomName) {
      toast({
        title: "Error",
        description: "Please enter a room name.",
        variant: "destructive",
      });
      return;
    }

    const newChallenge = {
      id: newId,
      title: roomName,
      category: "Custom",
      difficulty,
      points: difficulty === "Easy" ? 100 : difficulty === "Medium" ? 200 : 300,
      participants: 0,
      timeLimit: "2 hours", // Default value
      description: description || "No description provided.",
    };

    try {
      const apiBase = "https://106b-119-82-122-154.ngrok-free.app";

      const response = await fetch(`${apiBase}/rooms/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomid: newId.toString(),
          level: difficultyMapping[difficulty].toString(), 
          name: roomName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Room created successfully. API Response:", data);

        if (data.activeTimeLeft) {
          newChallenge.timeLimit = data.activeTimeLeft;
        }

        setChallenges((prevChallenges) => [...prevChallenges, newChallenge]);

        toast({
          title: "Room Created",
          description: `Room "${roomName}" has been added. Active time left: ${
            data.activeTimeLeft || "2 hours"
          }`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create room. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    }

    setIsModalOpen(false);
    setRoomName("");
    setDescription("");
    setDifficulty("Easy");
  };

  const joinChallenge = async (roomId: string) => {
    try {
      const apiBase = "https://106b-119-82-122-154.ngrok-free.app";
  
      const response = await fetch(`${apiBase}/rooms/join/${roomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
           userid: "12222"
        }),
      });
  
      const data = await response.json();
      console.log(data)
      setCurrentUserId((prevId) => prevId + 1);
      setPopupData(data.ctfdurl);
      setIsPopupOpen(true);
  
      // toast({
      //   title: "Joined Challenge Successfully",
      //   description: (
      //     <>
      //       <p>
      //         <strong>URL:</strong>{" "}
      //         <a
      //           href={data.data.ctfdurl}
      //           target="_blank"
      //           rel="noopener noreferrer"
      //           className="text-blue-500 underline"
      //         >
      //           {data.data.ctfdurl}
      //         </a>
      //       </p>
      //       <p>
      //         <strong>Password:</strong> {data.data.password}
      //       </p>
      //     </>
      //   ),
      // });
    } catch (error) {
      console.error("Error joining challenge:", error);
      toast({
        title: "Error",
        description: "Failed to join the challenge. Please try again.",
        variant: "destructive",
      });
    }
  };
  

  const filteredChallenges = challenges.filter((challenge) =>
    challenge.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-16 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Active Rooms</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsModalOpen(true)}>Create Room</Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">Create New Room</DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              <Input
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <Input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}
                className="w-full border p-2 rounded-md"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateRoom} className="w-full">
                Create Room
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search challenges..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge) => (
            <Card key={challenge.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary">{challenge.category}</Badge>
                    <Badge
                      variant={challenge.difficulty === "Easy" ? "default" : "destructive"}
                    >
                      {challenge.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">{challenge.points}</div>
              </div>

              <p className="text-muted-foreground mb-4">{challenge.description}</p>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {challenge.participants} participants
                </div>
                <div className="flex items-center">
                  <Timer className="h-4 w-4 mr-1" />
                  {challenge.timeLimit}
                </div>
              </div>

              <Button
  onClick={() => joinChallenge(challenge.id.toString())}
  variant="outline"
  className="mt-4 w-full"
>
  Join Challenge
</Button>

            </Card>
          ))
        ) : (
          <p>No challenges found.</p>
        )}
      </div>
      <SimplePopup
        isOpen={isPopupOpen}
        data={popupData}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
}
