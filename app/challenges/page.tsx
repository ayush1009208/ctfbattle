"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Flag, Timer, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"; // Import Dialog components

const challenges = [
  {
    id: 1,
    title: "Web Exploitation 101",
    category: "Web",
    difficulty: "Easy",
    points: 100,
    participants: 45,
    timeLimit: "2 hours",
    description:
      "Learn the basics of web exploitation through a series of challenges.",
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
  // Add more challenges as needed
];

export default function ChallengePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roomId, setRoomId] = useState(1); // Tracks the next room ID
  const [user, setUser] = useState({
    id: "user123", // Replace with real user data
    name: "John Doe",
    email: "johndoe@example.com",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy"); // Typing difficulty explicitly

  // Map difficulty to numeric value
  const difficultyMap = {
    Easy: 1,
    Medium: 2,
    Hard: 3,
  };

  const handleCreateRoom = async () => {
    const apiBase = "https://0b64-119-82-122-154.ngrok-free.app";

    try {
      // Step 1: Add user to the database
      await fetch(`${apiBase}/users/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: user.id,
          name: user.name,
          email: user.email,
        }),
      });

      // Step 2: Create a new room with difficulty as a numeric value
      const createRoomResponse = await fetch(`${apiBase}/rooms/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomid: roomId,
          name: roomName || `Room ${roomId}`, // Default to `Room {id}` if no name is entered
          difficulty: difficultyMap[difficulty], // Send the numeric value for difficulty
        }),
      });

      const createRoomData = await createRoomResponse.json();
      console.log("Room created. Active time left:", createRoomData.activeTimeLeft);

      // Step 3: Join the room
      const joinRoomResponse = await fetch(
        `${apiBase}/rooms/join/${roomId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: user.id,
          }),
        }
      );

      const joinRoomData = await joinRoomResponse.json();
      console.log("Joined room:", joinRoomData);

      // Increment the room ID for the next creation
      setRoomId((prevRoomId) => prevRoomId + 1);

      // Close the modal after room creation
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating room:", error);
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
            <div className="mb-6">
              <label className="block mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")} // Typecast to the specific string union
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
        {filteredChallenges.map((challenge) => (
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

            <Button className="w-full mt-4">
              <Flag className="mr-2 h-4 w-4" />
              Join Challenge
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
