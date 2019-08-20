import React, { Component } from 'react'
import {Tree} from 'antd'
import menuList from '../../config/menuConfig'
import PropTypes from 'prop-types'
const TreeNode=Tree.TreeNode


export default class AuthTree extends React.Component {
 
    static propTypes={
        role:PropTypes.object
    }

    state={
        checkedKeys:[]  //受控组件
    }
        /* <TreeNode title="parent 1-0" key="0-0-0" >
              <TreeNode title="leaf" key="0-0-0-0" />
              <TreeNode title="leaf" key="0-0-0-1" />
            </TreeNode>*/

/*
把勾选的属性传递过去
*/
   getMenus=()=>{
       return this.state.checkedKeys
   }

    getTreeNodes=(menuList)=>{
        return (
            menuList.map((item)=>{
                
                return (
                    <TreeNode title={item.title} key={item.key}>
                        {item.children ? this.getTreeNodes(item.children) : null}
                    </TreeNode>
                    
                )
            })
        )
    }
    handleCheck=(checkedKeys)=>{
        console.log(this.state.checkedKeys)
        this.setState({
            checkedKeys
        })
    }
    componentWillMount() {
        const menus = this.props.role.menus
        this.setState({ checkedKeys: menus })
      }
/* 
获取当前设置权限人的权限信息
组件将要接收到新的props,
*/
  componentWillReceiveProps(nextProps) {
    // 读取最新传入的role, 更新checkedKeys状态
    const menus = nextProps.role.menus
    this.setState({ checkedKeys: menus })
  }
   

  render() {
    const {checkedKeys}=this.state
    return (
        <Tree
          checkable
          defaultExpandAll
          onCheck={this.handleCheck}  //手动选中的时候更新状态
          checkedKeys={checkedKeys}  //受控组件，自动更新选中状态
      >
       <TreeNode title="平台权限" key="0-0">
            {
              this.getTreeNodes(menuList)
            }

          </TreeNode>
      </Tree>
    )
        }
    }