import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NameEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  score: number;
  totalQuestions: number;
}

export const NameEntryModal = ({
  isOpen,
  onClose,
  onSubmit,
  score,
  totalQuestions,
}: NameEntryModalProps) => {
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }
    
    if (playerName.length > 15) {
      setError("Name must be 15 characters or less");
      return;
    }
    
    onSubmit(playerName);
    setPlayerName("");
    setError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-xl p-6">
        <DialogTitle className="text-2xl font-montserrat font-bold text-[#0e1e5b] mb-4">
          Add Your Name to the Leaderboard
        </DialogTitle>
        
        <p className="text-gray-600 font-roboto mb-6">
          Congratulations on your score of {score}/{totalQuestions}! Enter your name to be added to the leaderboard.
        </p>
        
        <div className="mb-6">
          <label htmlFor="player-name" className="block text-gray-700 font-roboto mb-2">
            Your Name:
          </label>
          <Input
            type="text"
            id="player-name"
            value={playerName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e1e5b]"
            placeholder="Enter your name"
            maxLength={15}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        
        <div className="flex space-x-4">
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-[#0e1e5b] hover:bg-blue-800 text-white font-montserrat font-bold py-3 rounded-lg transition-all duration-300"
          >
            Submit
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-montserrat font-bold py-3 rounded-lg transition-all duration-300"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NameEntryModal;
