export enum MODULES {
    DASHBOARD_PRINCIPAL = 'DASHBOARD_PRINCIPAL',
    MODULE_CUSTOMER = 'MODULE_CUSTOMER',
    MODULE_CONTRACTS = 'MODULE_CONTRACTS'
}

export const REGEX:object = {
    EMAIL: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, 
    NUMBER: /^\d+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
    AMOUNT: /^\d{1,3}(,\d{3})*(\.\d{1,2})?$/
}

export const defaultPageParams:object = {
    page: 0,
    size: 10
}

export const pageSizeOptions:number[] = [10, 20, 50, 100];

export enum FORMAT_DATE {
    GENERAL_FORMAT_DATE = "yyyy-MM-DD",
    GENERAL_FORMAT_DATE_TIME = "YYYY-MM-DD, hh:mm:ss",
    ES_FORMAT_DATE = 'DD-MM-YYYY',
    EN_FORMAT_DATE = 'YYYY-MM-DD'
}

export enum AMORTIZATION
{
    ALEMAN = "ALEMAN",
    AMERICANO = "AMERICANO",
    FRANCES = "FRANCES"
}

export enum PERIOD_DATE {
    MES = 'mes',
    QUINCENAL = 'quincenal'
}

export enum INTEREST_RATE {
    MES = 'mes',
    ANUAL = 'anual'
}

export const ARRAY_PERIOD_DATE:object[] = [
    {
    label: 'Mensual',
    // eslint-disable-next-line prefer-regex-literals
    value: PERIOD_DATE.MES
    }, 
    {
    label: 'Quincenal',
    // eslint-disable-next-line prefer-regex-literals
    value: PERIOD_DATE.QUINCENAL
    }
];

export const ARRAY_INTEREST_RATE:object[] = [
    {
        label: 'Mensual',
        value: INTEREST_RATE.MES
    },
    {
        label: 'Anual',
        value: INTEREST_RATE.ANUAL
    }
]

export const ARRAY_AMORTIZATION:object[] =[
    {
        value: AMORTIZATION.ALEMAN,
        label: AMORTIZATION.ALEMAN,
        tooltip: 'En el metodo aleman la amoritzacion al capital del credito es fija y los intereses van disminuyendo en el tiempo, con esto el monto de cada cuota va disminuyendo hasta saldar el credito.'
    },
    {
        value: AMORTIZATION.AMERICANO,
        label: AMORTIZATION.AMERICANO,
        tooltip: 'En el metodo americano los intereses son fijos a lo largo del tiempo, mientras que la amortizacion al capital es cero, con esto cada cuota solo se paga el interes hasta la ultima cuota, donde la amortizacion es todo el capital del monto del credito mas el interes.'
    },
    {
        value: AMORTIZATION.FRANCES,
        label: AMORTIZATION.FRANCES,
        tooltip: 'En el metodo frances las cuotas son fijos, al inicio de las cuotas pesa mas el interes y menos la amortizacion del credito, y conforme avanza el plazo va pesando mas la amortizacion y menos el interes.'
    }
];

export enum STATUS_CONTRACT {
    BORRADOR = 1,
    ACTIVO = 2,
    ACTIVO_DEVENGADO = 3,
    DEVENGADO = 4,
    EN_CONVEION = 5,
    CONVENIO_DEVENGADO = 6,
    TERMINADO = 7
}
export const ARRAY_STATUS_CONTRACT:object[] = [
    {
        id: 1,
        value: "Borrador",
        bgColor: '#b1b1b1',
        color: 'black'
    },
    {
        id: 2,
        value: "Activo",
        bgColor: '#2cbf18',
        color: 'white'
    },
    {
        id: 3,
        value: "Activo - Devengado",
        bgColor: '#e48401',
        color: 'black'
    },
    {
        id: 4,
        value: "Devengado",
        bgColor: '#df1313',
        color: 'white'
    },
    {
        id: 5,
        value: "En Convenio",
        bgColor: '#015fdd',
        color: 'white'
    },
    {
        id: 6,
        value: "Convenio - Devengado",
        bgColor: '#e48401',
        color: 'black'
    },
    {
        id: 7,
        value: "Terminado",
        bgColor: '#474747',
        color: 'white'
    }
];