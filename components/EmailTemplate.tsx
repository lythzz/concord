export default function EmailTemplate({name, link}: {name: string | null | undefined, link: string}) {
    return (
        <div>
            <h1>Hi, {name}</h1>
            <h1>Click <a href={link}>here</a> to confirm your account</h1>
        </div>
    )
}