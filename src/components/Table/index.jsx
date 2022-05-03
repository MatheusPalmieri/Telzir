import { useState } from 'react';
import './style.css';

export function Table() {

    const [call, setCall] = useState({})
    const [selectValues, setSelectValues] = useState(['016', '017', '018'])
    
    function valueSelectChange() {
        var DDD = document.getElementsByName('DDDLocal')
        var selected
        DDD.forEach((value) => {
            if (value.selected)
                selected = value.value
        })

        if (selected !== '011') {
            setSelectValues(['011'])
        } else {
            setSelectValues(['016', '017', '018'])
        }
    }

    function calculate() {
        var DDDLocal = document.getElementById('DDDLocal')
        var DDDRecipient = document.getElementById('DDDRecipient')
        var planCall = document.getElementById('planCall')
        var timeCall = document.getElementById('timeCall').value

        DDDLocal = DDDLocal.options[DDDLocal.selectedIndex].value
        DDDRecipient = DDDRecipient.options[DDDRecipient.selectedIndex].value
        planCall = planCall.options[planCall.selectedIndex].value
        timeCall = timeCall === '' ? timeCall = 0 : timeCall

        var fixedTax = cfixedTax(DDDLocal, DDDRecipient)
        calculateValueCall(timeCall, planCall, fixedTax)
        setText(planCall)

        document.querySelector('.table-responsive').classList.add('show')
    }

    function cfixedTax(Dl, Dr) {
        var valueTax
        switch (Dl) {
            case '011':
                if (Dr === '016')
                    valueTax = 1.90
                else if (Dr === '017')
                    valueTax = 1.70
                else if (Dr === '018')
                    valueTax = 0.90
                else if (Dr === '011')
                    valueTax = 1.00
                break;
            case '016':
                valueTax = 2.90
                break;
            case '017':
                valueTax = 2.70
                break;
            case '018':
                valueTax = 1.90
                break;
            default:
                valueTax = 1.00
                break;
        }
        return valueTax
    }

    function calculateValueCall(minutes, plan, tax) {
        var valueMinutes = parseFloat(minutes)
        var valuePlan = parseFloat(plan)
        var valueCall = {
            withPlan: 0,
            noPlan: 0,
            economy: 0
        }

        if (plan === 'nenhum') {
            valueCall.withPlan = (valueMinutes * tax).toFixed(2)
            valueCall.noPlan = (valueMinutes * tax).toFixed(2)
        } else {
            valueCall.noPlan = (valueMinutes * tax).toFixed(2)
            if (valueMinutes <= valuePlan)
                valueCall.withPlan = 0.00
            else
                valueCall.withPlan = ((valueMinutes - valuePlan) * (tax * 1.1)).toFixed(2)
        }

        valueCall.economy = (valueCall.noPlan - valueCall.withPlan).toFixed(2)

        setCall(valueCall)
    }

    function setText(plan){
        if(plan !== 'nenhum'){
            document.getElementById('yPlan').innerHTML = "Com FaleMais" + plan
            document.getElementById('nPlan').innerHTML = "Sem FaleMais" + plan
            document.getElementById('economy').innerHTML = "Economia"
            document.getElementById('yPlan').classList.remove('none')
            document.getElementById('yPlanLig').classList.remove('none')
        } else {
            document.getElementById('nPlan').innerHTML = "Nenhum Plano Selecionado"
            document.getElementById('economy').innerHTML = "Economia"
            document.getElementById('yPlan').classList.add('none')
            document.getElementById('yPlanLig').classList.add('none')
        }
    }

    return (
        <div className='container'>
            
            {/* Informações */}

            <div className='form'>
                
                {/* DDD Local */}
                <div>
                    <div>
                        <label className='form-label'>Informe seu DDD</label>
                    </div>

                    <div>
                        <select id='DDDLocal'onChange={valueSelectChange} className="form-select">
                            <option name='DDDLocal' value='011'>011</option>
                            <option name='DDDLocal' value='016'>016</option>
                            <option name='DDDLocal' value='017'>017</option>
                            <option name='DDDLocal' value='018'>018</option>
                        </select>
                    </div>
                </div>

                {/* DDD Destino */}
                <div>
                    <div>
                        <label className='form-label'>Informe o DDD que deseja ligar</label>
                    </div>

                    <div>
                        <select id='DDDRecipient' className="form-select">
                            {selectValues.map((value) => {
                                return (<option name='DDDRecipient' key={value}>{value}</option>)
                            })}
                        </select>
                    </div>
                </div>

                {/* Tempo */}
                <div>
                    <div>
                        <label className='form-label'>Duração da chamada</label>
                    </div>

                    <div>
                        <input type={"number"} min={0} placeholder={"Exemplo: 45"} id='timeCall' className="form-control" />
                    </div>
                </div>

                {/* Plano */}
                <div>
                    <div>
                        <label className='form-label'>Selecione o Plano</label>
                    </div>
                    <div>
                        <select id='planCall' className="form-select" aria-label="Select on plan">
                            <option name='planCall' value={"nenhum"}>Não Tenho Plano</option>
                            <option name='planCall' value={"30"}>FaleMais30</option>
                            <option name='planCall' value={"60"}>FaleMais60</option>
                            <option name='planCall' value={"120"}>FaleMais120</option>
                        </select>
                    </div>
                </div>

                {/* Button */}
                <div className='button'>
                    <button onClick={calculate} className="btn btn-success">Calcular</button>
                </div>
            </div>

            {/* Resultado */}

            <div id="result" className='table-responsive'>
                <table className='table'>

                    {/* Titles */}
                    <thead>
                        <tr>
                            <th id='yPlan'></th>
                            <th id='nPlan'></th>
                            <th id='economy'></th>
                        </tr>
                    </thead>

                    {/* Resultado $ */}
                    <tbody>
                        <tr>
                            <td id='yPlanLig'>R&#36;{call.withPlan}</td>
                            <td>R&#36;{call.noPlan}</td>
                            <td>R&#36;{call.economy}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    )
}

// export default Table;
