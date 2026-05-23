import Image from "next/image";

export default function Internal() {
  return (
    <div className="apresentation flex flex-col items-center justify-center h-screen">
      <div className="box-logo">
        <Image
          src="https://i.pinimg.com/1200x/c9/70/79/c9707949e969fd0c80bb6d3c6eae2ae7.jpg"
          alt="Logo"
          fill
        />
      </div>
      <h1>Bem vindo a aplicação interna</h1>
      <p>Aqui você pode gerenciar suas propriedades e clientes</p>
    </div>
  );
}
