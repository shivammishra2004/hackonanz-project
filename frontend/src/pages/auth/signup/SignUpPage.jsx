import { Link } from "react-router-dom";
import { useState } from "react";

// import XSvg from "../../../components/svgs/X";
import MySvg from "../../../components/svgs/dusk_png(1).svg";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullName, password }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullName, password }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to create account");
				console.log(data);
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully");

			{
				/* Added this line below, after recording the video. I forgot to add this while recording, sorry, thx. */
			}
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault(); // page won't reload
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<img src={MySvg} className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					< img src={MySvg} className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>Welcome</h1>
					<label className='input input-bordered rounded flex items-center gap-2' style={{ backgroundColor: '#808080', color: 'white'}}>
						<MdOutlineMail />
						<input
							type='email'
							className='grow placeholder-white'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1' style={{ backgroundColor: '#808080', color: 'white'}}>
							<FaUser />
							<input
								type='text'
								className='grow placeholder-white'
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1' style={{ backgroundColor: '#808080', color: 'white'}}>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow placeholder-white'
								placeholder='Full Name'
								name='fullName'
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</label>
					</div>
					<label className='input input-bordered rounded flex items-center gap-2' style={{ backgroundColor: '#808080', color: 'white'}} >
						<MdPassword />
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
						{isPending ? "Loading..." : "Sign up"}
					</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-none bg-transparent text-white border-2 border-orange-500 w-full' style={{ borderRadius: '5px' }}>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;
