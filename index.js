/**
 * Created by ALIENWARE17 on 2016/8/15.
 */
import React from 'react'
import {render} from 'react-dom'
import Form from "react-jsonschema-form"

const myRender = (schema, uiSchema, formData, container, props) => {
    if (props.errorInfo && !props.transformErrors) {
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
