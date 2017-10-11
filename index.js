/**
 * Created by ALIENWARE17 on 2016/8/15.
 */
import React from 'react'
import {render} from 'react-dom'
import Form from "react-jsonschema-form"

const myRender = (schema, uiSchema, formData, container, props) => {
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
