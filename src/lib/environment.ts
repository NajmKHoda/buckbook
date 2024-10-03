/**
 * Retrieves the environment variable of the specified name, throwing an error if undefined.
 * @param name The name of the environment variable.
 * @returns The environment variable's value, if found.
 */
export default function getEnv(name: string) {
    const value = process.env[name];
    if (!value) throw new Error(`Environment variable ${name} is not defined.`);
    return value;
}