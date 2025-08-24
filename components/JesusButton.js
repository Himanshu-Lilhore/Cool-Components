export default function JesusButton() {
    return (
        <button className="group relative mx-10 bg-black/40 px-[0.6vw] py-[0.2vw] duration-300 transition-all [&>div]:transition-all [&>div]:duration-300">
            <div>Himanshu</div>
            <div className="absolute group-hover:h-0 group-hover:opacity-0 h-[140%] w-[0.05vw] bg-white left-0 top-[50%] group-hover:top-0 translate-y-[-50%]"></div>
            <div className="absolute group-hover:w-0 group-hover:opacity-0 w-[120%] h-[0.05vw] bg-white delay-200 bottom-0 left-[50%] group-hover:left-0 translate-x-[-50%]"></div>
            <div className="absolute group-hover:h-0 group-hover:opacity-0 h-[140%] w-[0.05vw] bg-white delay-400 right-0 bottom-[50%] group-hover:bottom-0 translate-y-[50%]"></div>
            <div className="absolute group-hover:w-0 group-hover:opacity-0 w-[120%] h-[0.05vw] bg-white delay-600 top-0 right-[50%] group-hover:right-0 translate-x-[50%]"></div>
        </button>
    );
}
