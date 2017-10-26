/**
 * Created by ALIENWARE17 on 2016/8/15.
 */
import React from 'react'
import {render} from 'react-dom'
import Form from "react-jsonschema-form"

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
			//主列的value就是从列的key
			if (mainValue) {
				for (var childFieldInfo of props.cascadeSchema[mainPath]) {
					let childField = getvalue(schema.properties, childFieldInfo.name)
					childField.enum = childFieldInfo.dataSource[mainValue]
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

	var tipComponent = <div></div>
	if (props && props.autoCompleteSchema) {
		for (let mainPath in props.autoCompleteSchema) {
			let mainValue = getvalue(schema, mainPath)
			//主列的value就是从列的key
			if (mainValue) {
				console.log(mainValue)
				let tip = props.autoCompleteSchema[mainPath].dataSource(mainValue)
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
			const {func, time, value, placeholder, disabled, inputClass, buttonClass, inputValue} = this.state
			return (
				<div>
					<input type="text" className={inputClass} placeholder={placeholder}
					       value={inputValue || ""}
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
			)
		}
	}
	const fields = {validate: validate};
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
			// console.log(key+'对应的值未找到')
			break;
		}
	}
	return value
}

function deepClone(obj) {
	var newObj = obj instanceof Array ? [] : {};
	for (var i in obj) {
		newObj[i] = typeof obj[i] === 'object' ?
			deepClone(obj[i]) : obj[i];
	}
	return newObj;
}