
import { ActionReducerMapBuilder, PayloadAction } from "@reduxjs/toolkit";
import { ProjectTy, user_mstr_modal } from "../../Auth/types";
import { getAllProjectsByEPCid, getAllSubscribedLeads, getEPCProjects, getmoduleAcCable, getModuleCapacity, getmoduleDcCable, getModuleInveter, getModuleInveterById, getModuleInveterCapacity, getModuleManufacturer, getOwnLeadsDetails, getProjectsByProjectid, getPVModuleDetailsById, getPvNxtGenerationData, getSAMGenerationData, getWeatherDataSource, saveEPCProjects, saveLosses } from "./EpcAction";
import { EPCReducerTy, ModuleACcableResType, ModuleCBcableResType, dataSourceResType, lossCalculationType, moduleCapacityType, moduleDetailsType, moduleInverterCapacityValue, moduleInverterDetailsType, moduleInverterTy, ownLeadProjectTy } from "./type";
import { formatReactSelectOptions } from "../../../../Utils/commonFunctions";


export const buildEPCExtraReducers = (builder: ActionReducerMapBuilder<EPCReducerTy>) => {
    builder
        .addCase(getModuleManufacturer.fulfilled, (state, { payload }: PayloadAction<any[]>) => {
            state.roofAnalysis.moduleManufacturer = payload;
            // state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(getModuleManufacturer.pending, (state) => {
            // state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(getModuleManufacturer.rejected, (state, { payload }) => {
            state.roofAnalysis.moduleManufacturer = [];
            // state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch module manufacturers';
        })
        //getModuleCapacity
        .addCase(getModuleCapacity.fulfilled, (state, { payload }: PayloadAction<moduleCapacityType[]>) => {
            state.roofAnalysis.moduleCapacity = payload;
            state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(getModuleCapacity.pending, (state) => {
            state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(getModuleCapacity.rejected, (state, { payload }) => {
            state.roofAnalysis.moduleCapacity = [];
            state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch module manufacturers';
        })
        //getModuleInveter
        .addCase(getModuleInveter.fulfilled, (state, { payload }: PayloadAction<moduleInverterTy[]>) => {
            state.roofAnalysis.moduleInverter = payload;
            // state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(getModuleInveter.pending, (state) => {
            // state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(getModuleInveter.rejected, (state, { payload }) => {
            state.roofAnalysis.moduleInverter = [];
            // state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch module inveter';
        })
        //getModuleInveterCapacity
        .addCase(getModuleInveterCapacity.fulfilled, (state, { payload }: PayloadAction<moduleInverterCapacityValue[]>) => {
            state.roofAnalysis.moduleInverterCapacity = payload;
            // state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(getModuleInveterCapacity.pending, (state) => {
            // state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(getModuleInveterCapacity.rejected, (state, { payload }) => {
            state.roofAnalysis.moduleInverterCapacity = [];
            // state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch module inveter capacity';
        })

        // pvmodule details by id
        .addCase(getPVModuleDetailsById.fulfilled, (state, { payload }: PayloadAction<moduleDetailsType>) => {
            state.roofAnalysis.moduleDetails = payload;
            state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(getPVModuleDetailsById.pending, (state) => {
            state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(getPVModuleDetailsById.rejected, (state, { payload }) => {
            state.roofAnalysis.moduleDetails = {} as moduleDetailsType;
            state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch module inveter capacity';
        })
        //getModuleInveterById
        .addCase(getModuleInveterById.fulfilled, (state, { payload }: PayloadAction<moduleInverterDetailsType>) => {
            state.roofAnalysis.moduleInverterDetails = payload;
            state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(getModuleInveterById.pending, (state) => {
            state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(getModuleInveterById.rejected, (state, { payload }) => {
            state.roofAnalysis.moduleInverterDetails = {} as moduleInverterDetailsType;
            state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch module inveter capacity';
        })
        //getAllSubscribedLeads
        .addCase(getAllSubscribedLeads.fulfilled, (state, { payload }: PayloadAction<ProjectTy[]>) => {
            state.pvNxtLeads.PvNxt.RFPBid = payload;
            state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(getAllSubscribedLeads.pending, (state) => {
            state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(getAllSubscribedLeads.rejected, (state, { payload }) => {
            state.roofAnalysis.moduleManufacturer = [];
            state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch module manufacturers';
        })
        //getOwnLeadsDetails
        .addCase(getOwnLeadsDetails.fulfilled, (state, { payload }: PayloadAction<user_mstr_modal[]>) => {
            state.projectDetails = payload;
            state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(getOwnLeadsDetails.pending, (state) => {
            state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(getOwnLeadsDetails.rejected, (state, { payload }) => {
            state.projectDetails = [];
            state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch project details';
        })
        //getProjectsByProjectid
        .addCase(getProjectsByProjectid.fulfilled, (state, { payload }: PayloadAction<ProjectTy>) => {
            state.roofAnalysis.selectedProject = payload;
            state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(getProjectsByProjectid.pending, (state) => {
            state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(getProjectsByProjectid.rejected, (state, { payload }) => {
            state.roofAnalysis.selectedProject = {} as ProjectTy;
            state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch project details';
        })
        //saveEPCProjects
        .addCase(saveEPCProjects.fulfilled, (state, { payload }: PayloadAction<any>) => {
            state.roofAnalysis.selectedProject = payload;
            state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(saveEPCProjects.pending, (state) => {
            state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(saveEPCProjects.rejected, (state, { payload }) => {
            state.roofAnalysis.selectedProject = {} as ProjectTy;
            state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch project details';
        })
        //getWeatherDataSource
        .addCase(getWeatherDataSource.fulfilled, (state, { payload }: PayloadAction<dataSourceResType>) => {
            state.roofAnalysis.dataSource = payload;
            state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(getWeatherDataSource.pending, (state) => {
            state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(getWeatherDataSource.rejected, (state, { payload }) => {
            state.roofAnalysis.dataSource = {} as dataSourceResType;
            state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch project details';
        })
        //getEPCProjects
        .addCase(getEPCProjects.fulfilled, (state, { payload }: PayloadAction<ProjectTy[]>) => {
            state.projectDetails = payload;
            state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(getEPCProjects.pending, (state) => {
            state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(getEPCProjects.rejected, (state, { payload }) => {
            state.projectDetails = [];
            state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch project details';
        })
        //getmoduleAcCable
        .addCase(getmoduleAcCable.fulfilled, (state, { payload }: PayloadAction<ModuleACcableResType[]>) => {
            state.roofAnalysis.cableBtwACCBAndTP = payload;
            state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(getmoduleAcCable.pending, (state) => {
            state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(getmoduleAcCable.rejected, (state, { payload }) => {
            state.roofAnalysis.cableBtwACCBAndTP = [];
            state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch project details';
        })
        //getmoduleDcCable
        .addCase(getmoduleDcCable.fulfilled, (state, { payload }: PayloadAction<ModuleCBcableResType[]>) => {
            state.roofAnalysis.cableBtwModuleAndInverter = payload;
            state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(getmoduleDcCable.pending, (state) => {
            state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(getmoduleDcCable.rejected, (state, { payload }) => {
            state.roofAnalysis.cableBtwModuleAndInverter = [];
            state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch project details';
        })
        //saveLosses
        .addCase(saveLosses.fulfilled, (state, { payload }: PayloadAction<lossCalculationType<number>>) => {
            state.roofAnalysis.formDetails.plantinfrastructuredesigningNew.lossCalculation = payload;
            state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(saveLosses.pending, (state) => {
            state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(saveLosses.rejected, (state, { payload }) => {
            state.roofAnalysis.formDetails.plantinfrastructuredesigningNew.lossCalculation = {} as lossCalculationType<number>;
            state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch project details';
        })
        //getAllProjectsByEPCid
        .addCase(getAllProjectsByEPCid.fulfilled, (state, { payload }: PayloadAction<ProjectTy[]>) => {
            state.pvNxtLeads.cardView = payload;
            state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(getAllProjectsByEPCid.pending, (state) => {
            state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(getAllProjectsByEPCid.rejected, (state, { payload }) => {
            state.pvNxtLeads.cardView = [];
            state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch project details';
        })
        //getSAMGenerationData
        .addCase(getSAMGenerationData.fulfilled, (state, { payload }: PayloadAction<any>) => {
            state.roofAnalysis.generationSam = payload;
            state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(getSAMGenerationData.pending, (state) => {
            state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(getSAMGenerationData.rejected, (state, { payload }) => {
            state.roofAnalysis.generationSam = {};
            state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch sam generation details';
        })
           //getPvNxtGenerationData
           .addCase(getPvNxtGenerationData.fulfilled, (state, { payload }: PayloadAction<any>) => {
            state.roofAnalysis.generationPvNxt = payload;
            state.loadingModuleManufacturer = false;
            state.error = null;
        }).addCase(getPvNxtGenerationData.pending, (state) => {
            state.loadingModuleManufacturer = true;
            state.error = null;
        }).addCase(getPvNxtGenerationData.rejected, (state, { payload }) => {
            state.roofAnalysis.generationPvNxt = {};
            state.loadingModuleManufacturer = false;
            state.error = payload ?? 'Failed to fetch pvNxt generation details';
        })
};

