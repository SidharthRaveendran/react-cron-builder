// @flow

import React, {PureComponent, Children} from 'react'
import {EVERY} from 'data/constants'
import head from 'lodash/head'
import type {Option} from 'types/Option'
import {getValues} from 'utils'
import Select from '../Select'
import {DayOfWeek, DayOfMonth, Month} from './index'

type Props = {
    styleNameFactory: any,
    children?: any
}

type State = {
    activeComponent: React.Children
}

export default class DateComponent extends PureComponent {
    static defaultProps = {
        children: null
    };

    state: State = {
        activeComponent: DayOfWeek.className
    };

    props: Props;

    setActiveComponent = ({target: {value}}: any) => {
        this.setState({
            activeComponent: value
        })
    };

    onChange = (onChange: Function) => {
        return (value: Array<Option>) => {
            const values = getValues(value);
            const first = head(values);
            if(first === EVERY && values.length > 1) {
                onChange(values.filter((val: string) => val !== EVERY))
            } else {
                const everyIndex = values.indexOf(EVERY);
                if(everyIndex !== -1) {
                    onChange([EVERY])
                } else {
                    onChange(values)
                }
            }
        }
    };

    getDefaultValue = (values: any, options: Array<Option>) => {
        if (values instanceof Array) {
            return values.map(val => options.filter(option => option.value === val)[0])
        }

        return values
    };

    render() {
        const {styleNameFactory, children} = this.props;
        const {activeComponent} = this.state;
        return (
            <div
                style={{position: 'relative'}}
            >
                <label {...styleNameFactory('label')} >
                    On:
                </label>
                <div {...styleNameFactory('row', 'items-end')} >
                    {Children.map(children, (child: React.Children) => {
                        const {value, onChange} = child.props;
                        const {getOptions} = child.type;
                        const options = getOptions();
                        if (child.type.className === activeComponent) {
                            return (
                                <div
                                    {...styleNameFactory('input')}
                                >
                                    <Select
                                        styles={{container: () => ({minWidth: 120})}}
                                        defaultValue={this.getDefaultValue(value, options)}
                                        options={options}
                                        isMulti
                                        captureMenuScroll={false}
                                        onChange={this.onChange(onChange)}
                                    />
                                </div>
                            )
                        }

                        return null
                    })}
                </div>
                <div
                    style={{position: 'absolute'}}
                    {...styleNameFactory('link')}
                >
                    <select onChange={this.setActiveComponent} >
                        <option value={DayOfWeek.className}>day of week</option>
                        <option value={DayOfMonth.className}>day of month</option>
                        <option value={Month.className}>month</option>
                    </select>
                </div>
            </div>
        )
    }
}
