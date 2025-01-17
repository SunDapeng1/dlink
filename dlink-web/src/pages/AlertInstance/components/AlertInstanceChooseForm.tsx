import React, {useState} from 'react';
import {Modal,List,Card} from 'antd';

import {AlertInstanceTableListItem} from '../data.d';
import {connect} from "umi";
import {ALERT_CONFIG_LIST, ALERT_TYPE, AlertConfig} from "@/pages/AlertInstance/conf";
import {getAlertIcon} from "@/pages/AlertInstance/icon";
import {AlertStateType} from "@/pages/AlertInstance/model";
import DingTalkForm from "@/pages/AlertInstance/components/DingTalkForm";
import {createOrModifyAlertInstance} from "@/pages/AlertInstance/service";
import WeChatForm from "@/pages/AlertInstance/components/WeChatForm";

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: Partial<AlertInstanceTableListItem>) => void;
  onSubmit: (values: Partial<AlertInstanceTableListItem>) => void;
  modalVisible: boolean;
  values: Partial<AlertInstanceTableListItem>;
};

const AlertInstanceChooseForm: React.FC<UpdateFormProps> = (props) => {

  const {
    onSubmit: handleUpdate,
    onCancel: handleChooseModalVisible,
    modalVisible,
    values
  } = props;

  const [alertType, setAlertType] = useState<string>();

  const chooseOne = (item: AlertConfig)=>{
    setAlertType(item.type);
  };

  const onSubmit = async (value: any)=>{
    const success = await createOrModifyAlertInstance(value);
    if (success) {
      handleChooseModalVisible();
      setAlertType(undefined);
      handleUpdate(value);
    }
  };

  return (
    <Modal
      width={800}
      bodyStyle={{padding: '32px 40px 48px'}}
      title={values?.id?'编辑报警实例':'创建报警实例'}
      visible={modalVisible}
      onCancel={() => {
        setAlertType(undefined);
        handleChooseModalVisible();
      }}
      maskClosable = {false}
      destroyOnClose = {true}
      footer={null}
    >{
      (!alertType&&!values?.id)&&(<List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        dataSource={ALERT_CONFIG_LIST}
        renderItem={(item:AlertConfig) => (
          <List.Item onClick={()=>{chooseOne(item)}}>
            <Card>
              {getAlertIcon(item.type)}
            </Card>
          </List.Item>
        )}
      />)
    }
      {(values?.type == ALERT_TYPE.DINGTALK || alertType == ALERT_TYPE.DINGTALK)?
        <DingTalkForm
          onCancel={() => {
            setAlertType(undefined);
            handleChooseModalVisible();
          }}
          modalVisible={values?.type == ALERT_TYPE.DINGTALK || alertType == ALERT_TYPE.DINGTALK}
          values={values}
          onSubmit={(value) => {
            onSubmit(value);
          }}
        />:undefined
      }
      {(values?.type == ALERT_TYPE.WECHAT || alertType == ALERT_TYPE.WECHAT)?
        <WeChatForm
          onCancel={() => {
            setAlertType(undefined);
            handleChooseModalVisible();
          }}
          modalVisible={values?.type == ALERT_TYPE.WECHAT || alertType == ALERT_TYPE.WECHAT}
          values={values}
          onSubmit={(value) => {
            onSubmit(value);
          }}
        />:undefined
      }
    </Modal>
  );
};

export default connect(({Alert}: { Alert: AlertStateType }) => ({
  instance: Alert.instance,
}))(AlertInstanceChooseForm);
