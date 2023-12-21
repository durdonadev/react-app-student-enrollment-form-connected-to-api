class StudentAPI {
    constructor() {
        this.endpoint = process.env.REACT_APP_API;
    }

    async add(input) {
        const { firstName, lastName, email, className } = input;
        try {
            const response = await fetch(`${this.endpoint}/students`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    className: className
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }

            return await response.json();
        } catch (error) {
            console.log(error.message);
        }
    }

    async getAll() {
        try {
            const response = await fetch(`${this.endpoint}/students`);
            if (!response.ok) {
                throw new Error(response.error);
            }

            return await response.json();
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteOne(id) {
        try {
            const response = await fetch(`${this.endpoint}/students/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    async update(id, input) {
        try {
            const response = await fetch(`${this.endpoint}/students/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName: input.firstNameEditValue,
                    lastName: input.lastNameEditValue,
                    email: input.emailEditValue,
                    className: input.classNameEditValue
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }

            return await response.json();
        } catch (error) {
            console.log(error.message);
        }
    }
}

export const studentAPI = new StudentAPI();
