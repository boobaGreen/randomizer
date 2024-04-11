function Info(): JSX.Element {
  return (
    <div className="w-full h-auto flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-auto flex flex-col items-center">
          <p className="w-auto">
            <span className="text-white">
              This app is a demo studio project for{" "}
            </span>
          </p>
          <p>
            <span className="text-[var(--color-custom)]">
              ICP Typescript Master Class{" "}
            </span>
          </p>
          <p>
            <span className="text-white">for a first approach with </span>
          </p>
          <p>
            <span className="text-[var(--color-custom)]">AZLE </span>
          </p>
          <p className="w-auto">
            <span className="text-white">thanks to </span>
          </p>
          <p>
            <span className="text-[var(--color-custom)]">ICP ITALIA </span>
          </p>
          <p>
            <span className="text-white">and </span>
          </p>
          <p>
            <span className="text-[var(--color-custom)]">DEMERGENTS LABS </span>
          </p>
          <span className="text-white">and </span>
          <p />
          <p>
            <span className="text-[var(--color-custom)]">JORDAN LAST </span>
          </p>
        </div>
        <div></div>
        <div>
          <p className="w-auto mt-8">
            <span className="text-white ">More info in the readme file : </span>
            <span className="text-[var(--color-custom)]">
              <a href="https://github.com/boobaGreen/randomizer"> HERE </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Info;
