/**
 * Created by ALIENWARE17 on 2016/8/15.
 */
import React from 'react'
import {render} from 'react-dom'
import Form from "react-jsonschema-form"
import AutoComplete from 'react-autocomplete/build/lib/index'

class BlurForm extends Form {
	constructor(props) {
		super(props);
		const superOnBlur = this.onBlur;
		this.onBlur = (...args) => {
			const {formData} = this.state;
			const {errors, errorSchema} = this.validate(formData);
			this.setState({errors, errorSchema}, () => superOnBlur(...args));
		}
	}
}

const myRender = (schema, uiSchema, formData, container, props) => {
	// 处理用户定义错误信息
	if (props && props.errorInfo && !props.transformErrors) {
		props.transformErrors = errors => {
			return errors.map(error => {
				for (var key in props.errorInfo) {
					if (error.name === props.errorInfo[key].name && error.property === "instance." + key) {
						return Object.assign({}, error, {
							message: props.errorInfo[key].message
						})
					}
				}
				return error
			})
		}
	}
	//处理用户定义级联
	if (props && props.cascadeSchema) {
		for (let mainPath in props.cascadeSchema) {
			let mainValue = getvalue(formData, mainPath)
            //主列的value就是从列的key]
			if (mainValue) {
				for (var childFieldInfo of props.cascadeSchema[mainPath]) {
					let childField = getvalue(schema.properties, childFieldInfo.name)
                    for (var data of childFieldInfo.dataSource.data) {
                        if (data.key === mainValue) {
                            if (childField.type === "string") {
                                childField.enum = data.enum
                                var childFieldValue = getvalue(formData, childFieldInfo.name)
                                var flag = contains(data.enum, childFieldValue)
                                if (!flag) {
                                    changeValue(formData, childFieldInfo.name, "")
                                }
                            }
                            else if (childField.type === "array") {
                                childField.items.enum = data.enum
                            }
                            else if (childField.type === "object") {
                                var properties = {}
                                data.enum.map((item) => {
                                    properties[item] = {
                                        type: "boolean",
                                        title: item,
                                    }
                                })
                                childField.properties = properties
                            }
                        }
                    }
				}
			}
			else {
				for (var childFieldInfo of props.cascadeSchema[mainPath]) {
					let childField = getvalue(schema.properties, childFieldInfo.name)
					childField.enum = []
				}
			}
		}
	}



	if (!props || !props.onChange) {
		if (!props) {
			props = {}
		}
		const newOnChange = (props, deepClone, container) => param => {
			const schema = deepClone(param.schema)
			const uiSchema = deepClone(param.uiSchema)
			const formData = deepClone(param.formData)
			myRender(schema, uiSchema, formData, container, props)
		}
		props.onChange = newOnChange(props, deepClone, container)

	}
	//验证组件
	class validate extends React.Component {
		constructor(props) {
			super(props)
			this.state = Object.assign({}, props.formData)
		}

		onChange(name) {
			return (event) => {
				this.setState({
					[name]: event.target.value
				})
			}
		}

		render() {
			const {func, time, value, placeholder, disabled, inputClass, buttonClass, inputValue, title, id} = this.state
			return (
				<div>
					<label className="control-label" htmlFor={id}>{title}</label>
					<div>
						<input type="text" className={inputClass} placeholder={placeholder}
						       value={inputValue || ""} id={id}
						       onChange={this.onChange("inputValue")}
						/>
						<button className={buttonClass}
						        disabled={disabled || false}
						        onClick={() => {
							        func()
							        this.setState({disabled: true})
							        const defaultValue = value
							        let i = time / 1000
							        this.setState({value: i + "s"})
							        const t1 = setInterval(() => {
								        if (i-- > 1) {
									        this.setState({value: i + "s"})
								        } else {
									        this.setState({value: defaultValue, disabled: false})
									        clearInterval(t1)
								        }
							        }, 1000)
						        }}>{value}</button>
					</div>
				</div>
			)
		}
	}


    class AutoCompleteField extends React.Component {
        constructor(props) {
            super(props)
            this.state = {}
        }

        render() {
            const {getNewTip, placeholder, rowClass, inputClass, titleClass} = this.props.schema.properties
            const {title} = this.props.schema

            return (
                <div>
                    <label className={titleClass ? titleClass : "control-label"}>{title}</label><br/>
                    <AutoComplete
						className={inputClass ? inputClass : ""}
						inputProps={{
                            placeholder: placeholder ? placeholder : "请输入查询信息",
                        }}
						menuStyle={{
                            borderRadius: '3px',
                            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                            background: 'rgba(255, 255, 255, 0.9)',
                            padding: '2px 0',
                            fontSize: '90%',
                            position: 'relative',
                            overflow: 'auto',
                            maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
                        }}


						items={this.state && this.state.dataSource !== undefined && this.state.dataSource !== null ? this.state.dataSource : []}
						getItemValue={(item) => item}
						value={this.state.value ? this.state.value : ""}
						onChange={(event, value) => {
                            this.setState({value: value})
                            const newTip = getNewTip(value)
                            this.setState({dataSource: newTip})
                        }}
						onSelect={(value, item) => {
                            this.setState({value: value})
                        }}

						renderItem={item => {
                            return <div className={rowClass} key={item}>{item}</div>
                        }}

						renderMenu={(items, value, style) => {
                            if (items.length > 0) {
                                return <div style={Object.assign(style, this.menuStyle)} children={items}/>
                            }
                            else {
                                return <div hidden="true" children={items}/>
                            }
                        }}
                    >

                    </AutoComplete>
                </div>


            );
        };
    }


    const fields = {
        validate: validate,
        autoCompleteField: AutoCompleteField
    };



	render((
		<BlurForm schema={schema}
		          uiSchema={uiSchema}
		          formData={formData}
		          showErrorList={false}
		          fields={fields}
		          {...props}
		>
			<button className="btn btn-info" type="submit">提交</button>
		</BlurForm>
	), document.getElementById(container))
}

window.myRender = myRender.bind(this)

/**
 * 根据所给路径获取获取对象
 * @param data react-jsonschema-form的某个schema
 * @param path data中的路径
 * @returns 路径对应对象
 */
function getvalue(data, path) {
	let value = data
	let keyList = path.split('/')
	for (var pathValue of keyList) {

		value = value[pathValue]
		if (!value) {
			break;
		}
	}
	return value
}

/**
 * 根据所给路径返回对象应该修改成的数值
 * @param data react-jsonschema-form的某个schema
 * @param path data中的路径
 * @returns 对象应该修改成的数值
 */
function changeValue(data, path, newValue) {
    let value = data
    let keyList = []
    let returnValue = data
    if (typeof path == 'string') {
        keyList = path.split('/')
    }
    else {
        keyList = path
        keyList.shift()
    }
    if (keyList.length === 1) {
        returnValue[keyList[0]] = newValue
    }
    else {
        returnValue[keyList[0]] = changeValue(value[keyList[0]], keyList, newValue)
    }
    return returnValue
}


function deepClone(obj) {
	var newObj = obj instanceof Array ? [] : {};
	for (var i in obj) {
		newObj[i] = typeof obj[i] === 'object' ?
			deepClone(obj[i]) : obj[i];
	}
	return newObj;
}

function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}