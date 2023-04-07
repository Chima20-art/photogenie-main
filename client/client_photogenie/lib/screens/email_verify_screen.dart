import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

class EmailVerificationScreen extends StatefulWidget {
  const EmailVerificationScreen({super.key});

  @override
  State<EmailVerificationScreen> createState() => _EmailVerificationScreenState();
}

class _EmailVerificationScreenState extends State<EmailVerificationScreen> {
  late final VideoPlayerController _videoPlayerController;

  // bool _isLoading = false;
  @override
  void initState() {
    _videoPlayerController =
        VideoPlayerController.asset('assets/video/bgvideo.mp4')
          ..initialize().then((context) {
            _videoPlayerController.play();
            _videoPlayerController.setLooping(true);
            setState(() {});
          });
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
    _videoPlayerController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff0F0E17),
      resizeToAvoidBottomInset: false,
      body: Stack(children: <Widget>[
        SizedBox.expand(
          child: FittedBox(
            fit: BoxFit.cover,
            child: SizedBox(
              height: _videoPlayerController.value.size.height,
              width: _videoPlayerController.value.size.width,
              child: VideoPlayer(_videoPlayerController),
            ),
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          width: double.infinity,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(
                height: 70,
              ),
              Image.asset(
                'assets/images/logo.png',
                width: 170,
                height: 230,
              ),
              const SizedBox(
                height: 60,
              ),
            ],
          ),
        ),
      ]),
    );
  }
}
































// import 'package:flutter/material.dart';

// class EmailVerification extends StatelessWidget {
//   const EmailVerification({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       padding: const EdgeInsets.symmetric(horizontal: 50),
//       width: double.infinity,
//       decoration: const BoxDecoration(
//         image: DecorationImage(
//           image: AssetImage('assets/images/background.jpg'),
//           fit: BoxFit.cover,
//         ),
//       ),
//       child: Scaffold(
//         backgroundColor: Colors.transparent,
//         body: Center(
//           child: Column(
//             crossAxisAlignment: CrossAxisAlignment.center,
//             children: [
//               const SizedBox(
//                 height: 150,
//               ),
//               Image.asset(
//                 'assets/images/verifyemail.png',
//                 width: 250,
//                 height: 250,
//               ),
//               const SizedBox(
//                 height: 50,
//               ),
//               const Text(
//                 'Verify your email',
//                 style: TextStyle(
//                     fontSize: 25,
//                     fontWeight: FontWeight.bold,
//                     color: Color(0xff57475B)),
//               ),
//               const SizedBox(height: 20),
//               const Text(
//                 'Verify your email to continue email create , \n in order to create an avatar looks like you \n click on the link in your email .',
//                 textAlign: TextAlign.center,
//                 style: TextStyle(
//                     fontSize: 12, color: Color(0xff57475B), height: 1.25),
//               ),
//               const SizedBox(height: 60),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }
