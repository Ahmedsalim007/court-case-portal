import { useState } from 'react';

export default function usePartyFields(
  initialParties = [
    { name: '', role: 'Plaintiff' },
    { name: '', role: 'Defendant' },
  ]
) {
  const [parties, setParties] = useState(initialParties);

  const handlePartyChange = (index, field, value) => {
    setParties((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const addParty = () => {
    setParties((prev) => [...prev, { name: '', role: 'Plaintiff' }]);
  };

  const removeParty = (index) => {
    setParties((prev) => prev.filter((_, i) => i !== index));
  };

  return { parties, setParties, handlePartyChange, addParty, removeParty };
}
