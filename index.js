/**
 * Created by ALIENWARE17 on 2016/8/15.
 */
import React from 'react'
import {render} from 'react-dom'
import Form from "react-jsonschema-form"

const myRender = (schema, uiSchema, formData, container, props) => {
    // 处理用户定义错误信息
    if (props && props.errorInfo && !props.transformErrors) {
        const transformErrors = errors => {
            var result = errors.map(error => {
                for (var key in props.errorInfo) {
                    if (error.name === props.errorInfo[key].name && error.property === "instance." + key) {
                        return Object.assign({}, error, {
                            message: props.errorInfo[key].message
                        })
                    }
                }
                return error

            })
            return result
        }
        props.transformErrors = transformErrors
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
	render((
		<Form schema={schema}
		      uiSchema={uiSchema}
		      formData={formData}
		      {...props}
		>
			<button className="btn btn-info" type="submit">提交</button>
		</Form>
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