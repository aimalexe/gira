'use client';

import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '@/lib/auth';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center text-indigo-800">Login</h1>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={async (values, { setSubmitting, setFieldError }) => {
                    try {
                        await login(values.email, values.password);
                        router.push('/');
                    } catch (err: any) {
                        setFieldError('email', err.response?.data?.message || 'Login failed');
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-indigo-700">
                                Email
                            </label>
                            <Field
                                id="email"
                                name="email"
                                type="email"
                                className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
                            />
                            <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-indigo-700">
                                Password
                            </label>
                            <Field
                                id="password"
                                name="password"
                                type="password"
                                className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
                            />
                            <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}