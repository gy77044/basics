const EpcFinanceCard = ({icon, name, content,header, bgCss, borderCss}:{icon:JSX.Element,header:string, name:string, content:string, bgCss:string, borderCss:string}) => {
    return (
        <div style={{backgroundImage: `${bgCss==="blue"?"linear-gradient(#ffffff, #8cb2d3)":"linear-gradient(#ffffff, #b4ccb6)"}`}} className={`${borderCss}  p-2 border-[0.1vh] border-grey-700 space-y-[1vh] w-[350px] h-[173px] rounded-lg`}>
          <div className="text-yellow-100 text-[2vh] font-semibold">{icon}</div>
          <p className={`${bgCss==="blue"?"text-blue-200":"text-green-600"} text-2xl font-semibold leading-[2vh]`}>{header}</p>
          {/* <p className={`${bgCss==="blue"?"text-blue-300":"text-green-700"} text-1.2xl font-medium leading-[1vh]`}>{name}</p> */}
          <p className={`${bgCss==="blue"?"text-blue-300":"text-green-700"} text-1.2xl font-medium leading-[1.4vh]`}>{content}</p>
        </div>
    )
  }
   
  export default EpcFinanceCard