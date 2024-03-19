import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullName: "",
        role: "" // Added role to formData
    });
    const [error, setError] = useState("");
/**Still using fetching to signUp 
 * TODO: use mutation to signUp @tanstack/react-query
 * 
 */
    const signUp = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (!formData.role) {
            setError("Please select a role.");
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/sign-up", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong.");
            }

            navigate("/sign-in");
        } catch (error) {
            setError(error.message);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    return (
        <main className="sign-up-body flex flex-col px-24 py-8 mt-[6rem] mb-[6rem] gap-[2rem]">
            <h2 className="text-2xl bg-gray-900 text-white italic px-24 py-8 font-semibold">Sign Up</h2>
            <p>Skapa ett konto.</p>
            {error && <p className="bg-red-500 text-white p-4 rounded-xl">{error}</p>}
            
            <form onSubmit={signUp} className="flex flex-col gap-[2rem]">
                <input name="email" value={formData.email} onChange={handleFormChange} placeholder="Email" type="email" className="border-2 border-gray-200 p-2 rounded-full" />
                <input name="password" value={formData.password} onChange={handleFormChange} placeholder="Password" type="password" className="border-2 rounded-full border-gray-200 p-2" />
                <input name="fullName" value={formData.fullName} onChange={handleFormChange} placeholder="Full Name" type="text" className="border-2 rounded-full border-gray-200 p-2" />
                
                {/* Role selection */}
                <select name="role" value={formData.role} onChange={handleFormChange} className="border-2 rounded-full border-gray-200 p-2 ">
                    <option value="">Select Role</option>
                    <option value="Picker">Picker</option>
                    <option value="Supervisor">Supervisor</option>
                </select>
                
                <button type="submit" className="bg-gray-900 text-white p-6 rounded-full">Register now!</button>
            </form>
        </main>
    );
}
