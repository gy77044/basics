import React from 'react'
import { useAppDispatch } from '../../../../ReduxTool/store/hooks'
import { setSolarOpen } from '../../../../ReduxTool/Slice/EquipmentSelection/SelectionReducer'
import { IconClose } from '../../../../assests/icons/ModalIcons'

const ModuleModal = ({ children }: { children: React.ReactElement }) => {
    const dispatch = useAppDispatch()
    return (
        <>
            <div className="relative flex flex-col w-[30vh] h-[28vh] p-2">
                <div className="absolute right-[1.5vh] cursor-pointer" onClick={e => dispatch(setSolarOpen(false))} ><IconClose /></div>
                {children}
            </div>

        </>
    )
}

export default ModuleModal
