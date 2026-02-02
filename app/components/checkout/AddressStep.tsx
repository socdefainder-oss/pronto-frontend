"use client";

import { useState } from "react";

interface AddressStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function AddressStep({ onNext, onBack }: AddressStepProps) {
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleNext = () => {
    if (deliveryType === "delivery") {
      if (!street || !number || !district || !city || !state) {
        alert("Preencha os campos obrigatórios do endereço");
        return;
      }
    }

    sessionStorage.setItem("checkout_delivery_type", deliveryType);
    if (deliveryType === "delivery") {
      sessionStorage.setItem("checkout_address", JSON.stringify({
        street,
        number,
        complement,
        district,
        city,
        state,
        zipCode,
      }));
    }
    onNext();
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Entrega</h3>

      <div className="space-y-4">
        <div 
          onClick={() => setDeliveryType("delivery")} 
          className={`p-4 border-2 rounded-xl cursor-pointer transition ${deliveryType === "delivery" ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-gray-400"}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryType === "delivery" ? "border-emerald-500" : "border-gray-300"}`}>
              {deliveryType === "delivery" && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900">Receber no meu endereço</div>
              <div className="text-sm text-gray-600">Delivery</div>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setDeliveryType("pickup")} 
          className={`p-4 border-2 rounded-xl cursor-pointer transition ${deliveryType === "pickup" ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-gray-400"}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryType === "pickup" ? "border-emerald-500" : "border-gray-300"}`}>
              {deliveryType === "pickup" && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900">Retirar no restaurante</div>
              <div className="text-sm text-gray-600">Pickup</div>
            </div>
          </div>
        </div>
      </div>

      {deliveryType === "delivery" && (
        <div className="mt-6 space-y-4 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-bold text-gray-900">Endereço de Entrega</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">CEP</label>
              <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500" />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Rua *</label>
              <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Número *</label>
              <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Complemento</label>
              <input type="text" value={complement} onChange={(e) => setComplement(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500" />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Bairro *</label>
              <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Cidade *</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Estado *</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} maxLength={2} required className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <button onClick={onBack} className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-gray-400 transition">
          Voltar
        </button>
        <button onClick={handleNext} className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition shadow-lg">
          Próximo
        </button>
      </div>
    </div>
  );
}
