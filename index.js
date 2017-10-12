/**
 * Created by ALIENWARE17 on 2016/8/15.
 */
import React from 'react'
import {render} from 'react-dom'
import Form from "react-jsonschema-form"

const myRender = (schema, uiSchema, formData, container, props) => {
    if (props.errorSchema && !props.transformErrors) {
        const transformErrors = errors => {
            return errors.map(error => {
                for (var key in props.errorSchema) {
                    if (error.name === props.errorSchema[key].name && error.property === "instance." + key) {
                        return Object.assign({}, error, {
                            message: props.errorSchema[key].message
                        })
                    }
                }
            })
        }
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
