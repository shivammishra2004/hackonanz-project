import { useState } from "react";
import { Link } from "react-router-dom";

// import XSvg from "../../../components/svgs/X";
import MySvg from "../../../components/svgs/Dusk.svg";

// import { MdOutlineMail } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { MdPassword } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const queryClient = useQueryClient();

	const {
		mutate: loginMutation,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch("https://hackonanz-project.onrender.com/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});

				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			// refetch the authUser
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen' style={{ backgroundColor: '' }}>
        <div className='flex-1 hidden lg:flex items-center justify-center'>
            <img src={MySvg} alt="Description" className='lg:w-2/3 fill-white' />
        </div>
        <div className='flex-1 flex flex-col justify-center items-center'>
            <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
                <img src={MySvg} alt="Description" className='w-24 lg:hidden fill-white' />
                <h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2' style={{ backgroundColor: '#808080', color: 'white'}} >
						{/* <MdOutlineMail /> */}
						<CiUser size= {18} />
						<input
							type='text'
							className='grow placeholder-white'
							placeholder='Username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2' style={{ backgroundColor: '#808080', color: 'white'}}>
						<MdPassword size= {18} />
						<input
							type='password'
							className='grow placeholder-white'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-none bg-orange-500 text-white border-2 border-orange-500 w-full' style={{ borderRadius: '5px' }}>
						{isPending ? "Loading..." : "Login"}
					</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>No account yet? No worries!</p>
					<Link to='/signup'>
					<button className='btn rounded-none bg-orange-500 text-white border-2 border-orange-500 w-full' style={{ borderRadius: '5px' }}>Join Us</button>

					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
